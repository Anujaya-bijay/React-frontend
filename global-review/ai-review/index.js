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

// Token-budget limits (Groq free tier: 6000 TPM for this model)
// Tightened to stay well under the 6000 TPM cap.
const MAX_CHARS_PER_FILE = 2000;        // was 8000
const MAX_TOTAL_CONTEXT_CHARS = 7000;   // was uncapped

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

  // Cap total combined code context so the whole prompt stays under the token budget
  const truncatedCodeContext = codeContext.length > MAX_TOTAL_CONTEXT_CHARS
    ? codeContext.substring(0, MAX_TOTAL_CONTEXT_CHARS) + '\n\n... [additional files truncated to fit token limit]'
    : codeContext;

  // Build missing files note
  const missingFilesNote = missingFiles.length > 0
    ? `\n\nNOTE: The following expected files are missing: ${missingFiles.join(', ')}. This may indicate incomplete implementation.`
    : '';

  // Build requirements summary (trimmed: was 2000 chars)
  const requirementsSummary = requirements
    ? `\n\n## Technical Requirements:\n${requirements.substring(0, 1000)}`
    : '';

  // Build instructions summary (trimmed: was 3000 chars)
  const instructionsSummary = instructions
    ? `\n\n## Challenge Instructions:\n${instructions.substring(0, 1200)}`
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