#!/usr/bin/env node

/**
 * AI Review Layer for RTK Query Course
 * 
 * Uses Groq API (Llama 3.1 8B) to provide qualitative code review
 * 
 * IMPORTANT: This review only runs if functional tests pass.
 * It receives:
 * - Challenge instructions and requirements (README.md - merged file)
 * - All user-created code files
 * 
 * Provides sophisticated feedback based on actual implementation vs requirements.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

// Load .env from repo root if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..', '..');
const envPath = join(repoRoot, '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*GROQ_API_KEY\s*=\s*(.+?)\s*$/);
    if (match) {
      process.env.GROQ_API_KEY = match[1].trim().replace(/^["']|["']$/g, '');
      break;
    }
  }
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

// File extensions to include in code review
const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Token-budget limits (Groq free tier: 6000 TPM for this model).
// Groq counts prompt tokens + max_tokens (completion budget) together,
// so both the prompt content AND max_tokens below need to stay tight.
const MAX_CHARS_PER_FILE = 2000;        // was 8000
const MAX_TOTAL_CONTEXT_CHARS = 6000;   // hard cap across all files combined
const MAX_REQUIREMENTS_CHARS = 1000;    // was 2000
const MAX_INSTRUCTIONS_CHARS = 1200;    // was 3000

/**
 * Reviews code using AI for qualitative feedback
 * @param {string} challengeId - Challenge ID
 * @param {object} challengeMetadata - Challenge metadata (includes filesToCheck, patternsRequired, etc.)
 * @param {string} projectDir - Project directory path
 */
export async function reviewCodeWithAI(challengeId, challengeMetadata, projectDir) {
  const results = {
    challengeId,
    timestamp: new Date().toISOString(),
    score: 0,
    feedback: [],
    strengths: [],
    improvements: [],
    readability: 0,
    maintainability: 0,
    overall: ''
  };

  try {
    // 1. Load challenge instructions and requirements from README.md (merged file)
    const challengeDir = join(projectDir, 'challenges', challengeId);
    const readmePath = join(challengeDir, 'README.md');
    
    let challengeInstructions = '';
    let challengeRequirements = '';

    if (existsSync(readmePath)) {
      const readmeContent = readFileSync(readmePath, 'utf-8');
      // Split README into instructions (before Technical Requirements) and requirements (after)
      const requirementsMatch = readmeContent.match(/## Technical Requirements(?: \(What Will Be Reviewed\))?/);
      if (requirementsMatch) {
        const splitIndex = requirementsMatch.index;
        challengeInstructions = readmeContent.substring(0, splitIndex);
        challengeRequirements = readmeContent.substring(splitIndex);
      } else {
        // If no Technical Requirements section, use entire README as instructions
        challengeInstructions = readmeContent;
      }
    }

    // 2. Read all user-created code files
    const codeFiles = [];
    const missingFiles = [];
    
    for (const filePath of challengeMetadata.filesToCheck || []) {
      const fullPath = join(projectDir, filePath);
      if (existsSync(fullPath)) {
        const content = readFileSync(fullPath, 'utf-8');
        // Only include if it's a code file and has meaningful content
        if (CODE_EXTENSIONS.includes(extname(fullPath)) && content.trim().length > 0) {
          codeFiles.push({
            file: filePath,
            content: content.substring(0, MAX_CHARS_PER_FILE)
          });
        }
      } else {
        missingFiles.push(filePath);
      }
    }

    // 3. Discover additional files user might have created in relevant directories
    const additionalFiles = discoverAdditionalFiles(challengeMetadata, projectDir);
    for (const file of additionalFiles) {
      // Avoid duplicates
      if (!codeFiles.some(f => f.file === file.file)) {
        codeFiles.push(file);
      }
    }

    if (codeFiles.length === 0) {
      return {
        ...results,
        error: 'No code files found to review. User must create the required files first.',
        score: 0
      };
    }

    // 4. Check if API key is available
    if (!GROQ_API_KEY) {
      return {
        ...results,
        error: 'GROQ_API_KEY environment variable not set. AI review skipped.',
        score: 0
      };
    }

    // 5. Build sophisticated prompt with all context
    const prompt = buildReviewPrompt(
      challengeId,
      challengeMetadata,
      challengeInstructions,
      challengeRequirements,
      codeFiles,
      missingFiles
    );

    // 6. Call Groq API
    const aiResponse = await callGroqAPI(prompt);

    // 7. Parse response
    const parsedResponse = parseAIResponse(aiResponse);

    return {
      ...results,
      ...parsedResponse,
      score: calculateAIScore(parsedResponse)
    };

  } catch (error) {
    return {
      ...results,
      error: error.message,
      score: 0
    };
  }
}

/**
 * Discover additional files user might have created
 */
function discoverAdditionalFiles(challengeMetadata, projectDir) {
  const additionalFiles = [];
  const checkedDirs = new Set();

  // Check directories mentioned in filesToCheck
  for (const filePath of challengeMetadata.filesToCheck || []) {
    const dir = dirname(filePath);
    if (!checkedDirs.has(dir)) {
      checkedDirs.add(dir);
      const fullDir = join(projectDir, dir);
      if (existsSync(fullDir)) {
        try {
          const files = readdirSync(fullDir);
          for (const file of files) {
            const fullPath = join(fullDir, file);
            if (statSync(fullPath).isFile() && CODE_EXTENSIONS.includes(extname(file))) {
              const relativePath = join(dir, file).replace(/\\/g, '/');
              // Only include if not already in filesToCheck
              if (!challengeMetadata.filesToCheck.includes(relativePath)) {
                try {
                  const content = readFileSync(fullPath, 'utf-8');
                  if (content.trim().length > 0) {
                    additionalFiles.push({
                      file: relativePath,
                      content: content.substring(0, MAX_CHARS_PER_FILE)
                    });
                  }
                } catch (e) {
                  // Skip files that can't be read
                }
              }
            }
          }
        } catch (e) {
          // Skip directories that can't be read
        }
      }
    }
  }

  return additionalFiles;
}

/**
 * Build sophisticated review prompt with all context
 */
function buildReviewPrompt(challengeId, challengeMetadata, instructions, requirements, codeFiles, missingFiles) {
  const challengeName = challengeMetadata.challengeName || challengeId;
  const skills = challengeMetadata.skills || [];
  const patternsRequired = challengeMetadata.patternsRequired || [];

  // Build code context
  const codeContext = codeFiles.map(f => 
    `File: ${f.file}\n\`\`\`typescript\n${f.content}\n\`\`\``
  ).join('\n\n---\n\n');

  // Cap total combined code context so the whole prompt stays under the token budget,
  // regardless of how many files the challenge has.
  const truncatedCodeContext = codeContext.length > MAX_TOTAL_CONTEXT_CHARS
    ? codeContext.substring(0, MAX_TOTAL_CONTEXT_CHARS) + '\n\n... [additional files truncated to fit token limit]'
    : codeContext;

  // Build missing files note
  const missingFilesNote = missingFiles.length > 0
    ? `\n\n⚠️ NOTE: The following expected files are missing: ${missingFiles.join(', ')}. This may indicate incomplete implementation.`
    : '';

  // Build requirements summary (trimmed)
  const requirementsSummary = requirements
    ? `\n\n## Technical Requirements:\n${requirements.substring(0, MAX_REQUIREMENTS_CHARS)}`
    : '';

  // Build instructions summary (trimmed)
  const instructionsSummary = instructions
    ? `\n\n## Challenge Instructions:\n${instructions.substring(0, MAX_INSTRUCTIONS_CHARS)}`
    : '';

  return `You are an expert RTK Query, Redux Toolkit, and TypeScript code reviewer. Review the following implementation for challenge "${challengeName}" (${challengeId}).

## Challenge Context:
- **Challenge ID**: ${challengeId}
- **Skills Focus**: ${skills.join(', ')}
- **Required Patterns**: ${patternsRequired.join(', ')}${instructionsSummary}${requirementsSummary}

## User's Implementation:

The following code files were created/modified by the user for this challenge:

${truncatedCodeContext}${missingFilesNote}

## Review Task:

Provide a comprehensive code review focusing on:

1. **Requirement Compliance** (30%):
   - Does the code meet all functional requirements?
   - Are all required patterns implemented correctly?
   - Are missing files a concern?

2. **Code Quality** (25%):
   - Readability: Is the code clear and well-structured?
   - TypeScript usage: Proper types and interfaces?
   - Code organization: Logical structure and separation of concerns?

3. **RTK Query Best Practices** (25%):
   - Correct use of createApi, fetchBaseQuery, endpoints
   - Proper hook usage (useGetUsersQuery, etc.)
   - Store integration and reducer setup
   - Error and loading state handling

4. **Maintainability** (20%):
   - Is the code maintainable and extensible?
   - Are there any code smells or anti-patterns?
   - Could the code be improved for future changes?

## Output Format:

Provide your review as JSON:

{
  "readability": <number 0-100>,
  "maintainability": <number 0-100>,
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "improvements": ["specific improvement 1 with file reference", "specific improvement 2 with file reference", "specific improvement 3 with file reference"],
  "overall": "<2-3 sentence assessment focusing on requirement compliance and RTK Query best practices>",
  "requirementCompliance": <number 0-100, how well requirements are met>
}

Be specific in your feedback. Reference specific files and code patterns. Focus on actionable improvements.`;
}

/**
 * Call Groq API
 */
async function callGroqAPI(prompt) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert RTK Query, Redux Toolkit, and TypeScript code reviewer. Provide detailed, specific, actionable feedback. Reference specific files and code patterns in your feedback.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1100 // Enough headroom for a complete JSON response without truncation, while staying under the 6000 TPM cap
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg = data?.error?.message || data?.error || response.statusText;
    throw new Error(`Groq API error (${response.status}): ${msg}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (content == null || typeof content !== 'string') {
    throw new Error('Groq API returned no content (check model/response shape)');
  }
  return content;
}

/**
 * Parse AI response
 */
function parseAIResponse(response) {
  const candidate = extractJSONCandidate(response);

  if (candidate) {
    try {
      const parsed = JSON.parse(candidate);
      return normalizeParsed(parsed);
    } catch (error) {
      // Attempt: response may have been truncated mid-object (e.g. hit max_tokens).
      // Try trimming back to the last complete top-level field and closing the object.
      const repaired = attemptJSONRepair(candidate);
      if (repaired) {
        try {
          const parsed = JSON.parse(repaired);
          return normalizeParsed(parsed);
        } catch (error2) {
          // fall through to manual extraction below
        }
      }
    }
  }

  // Fallback: extract information manually from plain text.
  // Only used if the model didn't return valid/repairable JSON at all.
  const readabilityMatch = response.match(/readability[:\s]+(\d+)/i);
  const maintainabilityMatch = response.match(/maintainability[:\s]+(\d+)/i);
  const complianceMatch = response.match(/requirementCompliance[:\s]+(\d+)/i);

  return {
    readability: readabilityMatch ? parseInt(readabilityMatch[1]) : 0,
    maintainability: maintainabilityMatch ? parseInt(maintainabilityMatch[1]) : 0,
    requirementCompliance: complianceMatch ? parseInt(complianceMatch[1]) : 0,
    strengths: extractList(response, /strengths?/i),
    improvements: extractList(response, /improvements?/i),
    overall: response.substring(0, 500)
  };
}

/**
 * Normalize a successfully-parsed JSON object into the results shape.
 */
function normalizeParsed(parsed) {
  return {
    readability: parsed.readability || 0,
    maintainability: parsed.maintainability || 0,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    overall: parsed.overall || '',
    requirementCompliance: parsed.requirementCompliance || 0
  };
}

/**
 * Extract the JSON object from a model response, robust to models that:
 * - wrap the JSON in ```json ... ``` fences (most common)
 * - include prose before/after the JSON, including prose that itself
 *   contains stray '{' or '}' characters (e.g. a code snippet showing
 *   object destructuring like `const { id, name } = arg;`), which breaks
 *   a naive "first { to last }" greedy match.
 */
function extractJSONCandidate(response) {
  // Attempt 1: explicit ```json ... ``` fence — most reliable signal, since
  // the model is deliberately marking this block as the JSON payload.
  const fenceMatch = response.match(/```json\s*([\s\S]*?)```/i);
  if (fenceMatch) return fenceMatch[1].trim();

  // Attempt 2: any ``` ... ``` fence whose content looks like an object.
  const anyFenceMatch = response.match(/```\s*(\{[\s\S]*?\})\s*```/);
  if (anyFenceMatch) return anyFenceMatch[1].trim();

  // Attempt 3: no fences present. Search backwards from the last '}' for a
  // '{' that yields a valid, parseable JSON object. This avoids matching an
  // earlier stray '{' from unrelated prose, since we accept the first
  // (rightmost) candidate that actually parses.
  const lastBraceIndex = response.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    for (let i = lastBraceIndex; i >= 0; i--) {
      if (response[i] === '{') {
        const candidate = response.substring(i, lastBraceIndex + 1);
        try {
          JSON.parse(candidate);
          return candidate;
        } catch (e) {
          // keep searching further back
        }
      }
    }
  }

  // Last resort: naive greedy match (may be wrong if prose contains braces,
  // but better than nothing — attemptJSONRepair gets a chance after this).
  const naive = response.match(/\{[\s\S]*\}/);
  return naive ? naive[0] : null;
}

/**
 * Try to repair a truncated JSON object string by dropping the incomplete
 * trailing field/array and re-closing brackets. Returns null if it can't
 * produce something parseable.
 */
function attemptJSONRepair(raw) {
  let str = raw.trim();

  // Cut back to the last comma or closing bracket that could end a valid field,
  // then close off any open arrays/objects.
  const lastGoodCloses = ['"', '}', ']'];
  let cutIndex = -1;
  for (let i = str.length - 1; i >= 0; i--) {
    if (lastGoodCloses.includes(str[i])) {
      cutIndex = i;
      break;
    }
  }
  if (cutIndex === -1) return null;

  str = str.substring(0, cutIndex + 1);

  // Count unclosed brackets/braces and append matching closers.
  let openBraces = 0;
  let openBrackets = 0;
  let inString = false;
  let prevChar = '';
  for (const ch of str) {
    if (ch === '"' && prevChar !== '\\') inString = !inString;
    if (!inString) {
      if (ch === '{') openBraces++;
      else if (ch === '}') openBraces--;
      else if (ch === '[') openBrackets++;
      else if (ch === ']') openBrackets--;
    }
    prevChar = ch;
  }

  // If we ended mid-string, close the string first
  if (inString) str += '"';
  // Trim any trailing comma before closing
  str = str.replace(/,\s*$/, '');
  str += ']'.repeat(Math.max(0, openBrackets)) + '}'.repeat(Math.max(0, openBraces));

  return str;
}

/**
 * Extract list items from text
 */
function extractList(text, keyword) {
  const lines = text.split('\n');
  const list = [];
  let inList = false;
  const matchesKeyword = (line) =>
    typeof keyword === 'string'
      ? line.toLowerCase().includes(keyword)
      : keyword.test(line);

  for (const line of lines) {
    if (matchesKeyword(line)) {
      inList = true;
      continue;
    }
    const trimmedLine = line.trim();
    // Skip lines that look like raw JSON key-value pairs (e.g. "readability": 80,)
    // rather than actual bullet content — these can leak in from a malformed AI response.
    const looksLikeJSONField = /^"[a-zA-Z]+"\s*:/.test(trimmedLine);
    if (inList && !looksLikeJSONField && (trimmedLine.startsWith('-') || trimmedLine.match(/^\d+\./) || trimmedLine.startsWith('"'))) {
      let item = trimmedLine.replace(/^[-•\d."]+\s*/, '').replace(/^["']|["']$/g, '');
      if (item) {
        list.push(item);
        if (list.length >= 5) break; // Allow up to 5 items
      }
    }
    if (inList && line.trim() === '' && list.length > 0) {
      break;
    }
  }

  return list.length > 0 ? list : [];
}

/**
 * Calculate AI score based on multiple factors
 */
function calculateAIScore(parsedResponse) {
  const readability = parsedResponse.readability || 0;
  const maintainability = parsedResponse.maintainability || 0;
  const requirementCompliance = parsedResponse.requirementCompliance || 0;

  // Weighted average: requirement compliance is most important
  // Since tests already passed, we focus on code quality
  const score = Math.round(
    (requirementCompliance * 0.4) +
    (readability * 0.3) +
    (maintainability * 0.3)
  );

  return Math.max(0, Math.min(100, score)); // Clamp between 0-100
}