import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Runs tests for a specific challenge
 */
export async function runTests(challengeId, projectDir) {
  const testFile = join(projectDir, 'tests', 'challenge-' + challengeId.split('-')[0] + '.test.tsx');

  if (!existsSync(testFile)) {
    return {
      score: 0,
      passed: false,
      error: 'Test file not found: ' + testFile,
      details: []
    };
  }

  const normalizedTestFile = testFile.split('\\').join('/');
  const quotedTestFile = '"' + testFile + '"';

  function extractForFile(rawOutput) {
    const raw = (rawOutput || '') + '';
    const jsonMatch = raw.match(/\{[\s\S]*"numTotalTests"[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : raw;
    const parsed = JSON.parse(jsonStr);

    const allSuites = parsed.testResults || [];
    const matchingSuites = [];

    for (let i = 0; i < allSuites.length; i++) {
      const suite = allSuites[i];
      const suiteName = (suite.name || '').split('\\').join('/');
      if (suiteName === normalizedTestFile) {
        matchingSuites.push(suite);
      }
    }

    const suitesToUse = matchingSuites.length > 0 ? matchingSuites : allSuites;

    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    for (let i = 0; i < suitesToUse.length; i++) {
      const suite = suitesToUse[i];
      const assertions = suite.assertionResults || [];
      for (let j = 0; j < assertions.length; j++) {
        totalTests = totalTests + 1;
        if (assertions[j].status === 'passed') {
          passedTests = passedTests + 1;
        } else if (assertions[j].status === 'failed') {
          failedTests = failedTests + 1;
        }
      }
    }

    const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    return {
      score: Math.round(score * 10) / 10,
      passed: failedTests === 0 && totalTests > 0,
      totalTests: totalTests,
      passedTests: passedTests,
      failedTests: failedTests,
      details: suitesToUse
    };
  }

  try {
    const output = execSync(
      'npm test -- ' + quotedTestFile + ' --run --reporter=json',
      {
        cwd: projectDir,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      }
    );

    return extractForFile(output);
  } catch (error) {
    try {
      const raw = (error.stdout || error.stderr || (error.output && error.output.join('')) || '') + '';
      return extractForFile(raw);
    } catch (innerError) {
      return {
        score: 0,
        passed: false,
        error: error.message,
        details: []
      };
    }
  }
}