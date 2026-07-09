import { execSync } from 'child_process';

/**
 * Runs ESLint on given files and returns a code quality score
 */
export async function runLinting(filePaths, projectDir) {
  const quotedFiles = filePaths.map(f => '"' + f + '"').join(' ');

  function extractJsonArray(rawOutput) {
    const raw = (rawOutput || '') + '';
    // ESLint --format json always outputs a top-level JSON array.
    // Find the first '[' and the last ']' and try to parse what's between.
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']');

    if (start === -1 || end === -1 || end < start) {
      throw new Error('No JSON array found in ESLint output');
    }

    const jsonStr = raw.slice(start, end + 1);
    return JSON.parse(jsonStr);
  }

  function scoreFromResults(results) {
    let errorCount = 0;
    let warningCount = 0;
    let fileCount = results.length;

    for (let i = 0; i < results.length; i++) {
      errorCount += results[i].errorCount || 0;
      warningCount += results[i].warningCount || 0;
    }

    // Simple scoring: start at 100, subtract per issue.
    // Errors cost more than warnings.
    let score = 100 - (errorCount * 10) - (warningCount * 2);
    if (score < 0) score = 0;

    return {
      score: Math.round(score * 10) / 10,
      passed: errorCount === 0,
      errorCount: errorCount,
      warningCount: warningCount,
      fileCount: fileCount,
      details: results
    };
  }

  try {
    const output = execSync(
      'npx eslint ' + quotedFiles + ' --format json',
      {
        cwd: projectDir,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      }
    );

    const results = extractJsonArray(output);
    return scoreFromResults(results);
  } catch (error) {
    // ESLint exits with non-zero status if there are lint errors,
    // even though it still printed valid JSON to stdout.
    try {
      const raw = (error.stdout || error.stderr || (error.output && error.output.join('')) || '') + '';
      const results = extractJsonArray(raw);
      return scoreFromResults(results);
    } catch (innerError) {
      // Genuine failure — files missing, ESLint itself crashed, etc.
      return {
        score: 0,
        passed: false,
        error: error.message,
        details: []
      };
    }
  }
}