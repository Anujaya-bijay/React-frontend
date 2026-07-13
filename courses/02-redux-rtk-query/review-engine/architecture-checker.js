import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * File-specific pattern rules
 */
function getFileSpecificPatterns(file) {
  if (file.includes("api/usersApi")) {
    return ["createApi", "fetchBaseQuery", "endpoints"];
  }
  if (file.includes("store")) {
    return ["reducer", "middleware"];
  }
  if (file.includes("UsersList")) {
    return ["useQueryHook"];
  }
  if (file.includes("main") || file.includes("index")) {
    return ["Provider"];
  }
  return [];
}

/**
 * Main checker
 */
export async function checkArchitecture(challengeMetadata, projectDir) {
  const filesToCheck = challengeMetadata.filesToCheck || [];

  const results = {
    score: 0,
    passed: false,
    patternsFound: [],
    patternsMissing: [],
    details: []
  };

  let totalChecks = 0;
  let passedChecks = 0;

  for (const file of filesToCheck) {
    const filePath = join(projectDir, file);
    const patternsRequired = getFileSpecificPatterns(file);

    if (!existsSync(filePath)) {
      results.details.push({
        file,
        error: 'File does not exist',
        patternsFound: [],
        patternsMissing: patternsRequired
      });
      continue;
    }

    const fileContent = readFileSync(filePath, 'utf-8');

    const fileResults = checkFileForPatterns(fileContent, patternsRequired);

    totalChecks += patternsRequired.length;
    passedChecks += fileResults.patternsFound.length;

    results.patternsFound.push(...fileResults.patternsFound);
    results.patternsMissing.push(...fileResults.patternsMissing);

    results.details.push({
      file,
      patternsFound: fileResults.patternsFound,
      patternsMissing: fileResults.patternsMissing
    });
  }

  results.score = totalChecks > 0
    ? Math.round((passedChecks / totalChecks) * 100 * 10) / 10
    : 100;

  results.passed = results.score >= 80;

  return results;
}

/**
 * Regex-based checker (no traverse dependency — avoids ESM/CJS interop issues)
 */
function checkFileForPatterns(content, patternsRequired) {
  const patternsFound = [];
  const patternsMissing = [];

  const regexChecks = {
    createApi: /\bcreateApi\s*\(/,
    fetchBaseQuery: /\bfetchBaseQuery\s*\(/,
    useQueryHook: /\buse[A-Za-z0-9_]*Query\s*\(/i,
    useMutationHook: /\buse[A-Za-z0-9_]*Mutation\s*\(/i,
    optimisticUpdate: /\.updateQueryData\s*\(/,
    mutation: /\bbuilder\s*\.\s*mutation\s*\(|(?:^|\s)mutation\s*[:(]/,
    endpoints: /\bendpoints\s*:/,
    providesTags: /\bprovidesTags\s*:/,
    invalidatesTags: /\binvalidatesTags\s*:/,
    tagTypes: /\btagTypes\s*:/,
    onQueryStarted: /\bonQueryStarted\s*:/,
    reducer: /\breducer\s*:/,
    middleware: /\bmiddleware\s*:/,
    Provider: /\bProvider\b/
  };

  for (const pattern of patternsRequired) {
    const regex = regexChecks[pattern];
    const matched = regex ? regex.test(content) : content.includes(pattern);

    if (matched) {
      patternsFound.push(pattern);
    } else {
      patternsMissing.push(pattern);
    }
  }

  return { patternsFound, patternsMissing };
}