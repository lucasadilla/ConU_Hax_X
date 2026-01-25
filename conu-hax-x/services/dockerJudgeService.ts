// Custom Docker-based code execution service
// This runs user code in isolated Docker containers
// Exactly like LeetCode/Codeforces/HackerRank

import { ITestCase } from '@/models/Ticket';
import { ITestResult } from '@/models/Attempt';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export interface DockerExecutionResult {
  testResults: ITestResult[];
  passed: boolean;
  passedCount: number;
  failedCount: number;
  totalCount: number;
  executionTime: number;
}

export class DockerJudgeService {
  /**
   * Execute code with test cases in Docker containers
   */
  static async executeTests(
    code: string,
    testCases: ITestCase[],
    language: string = 'javascript'
  ): Promise<DockerExecutionResult> {
    const startTime = Date.now();
    const results: ITestResult[] = [];

    // Run each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        const result = await this.runSingleTest(code, testCase, language, i);
        results.push(result);
      } catch (error) {
        results.push({
          testCaseIndex: i,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          error: error instanceof Error ? error.message : 'Execution error',
          isHidden: testCase.isHidden,
        });
      }
    }

    const passedCount = results.filter(r => r.passed).length;
    const failedCount = results.length - passedCount;
    const passed = passedCount === results.length;
    const executionTime = Date.now() - startTime;

    return {
      testResults: results,
      passed,
      passedCount,
      failedCount,
      totalCount: results.length,
      executionTime,
    };
  }

  /**
   * Run a single test in isolated Docker container
   */
  private static async runSingleTest(
    code: string,
    testCase: ITestCase,
    language: string,
    index: number
  ): Promise<ITestResult> {
    // Parse input and expected output
    let input: any;
    try {
      input = JSON.parse(testCase.input);
    } catch {
      input = testCase.input;
    }

    let expectedOutput: any;
    try {
      expectedOutput = JSON.parse(testCase.expectedOutput);
    } catch {
      expectedOutput = testCase.expectedOutput;
    }

    // Create temp directory for this test
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-'));
    
    try {
      // Wrap code with test input
      const fullCode = this.wrapCode(code, input, language);
      
      // Write code to temp file
      const ext = this.getFileExtension(language);
      const codePath = path.join(tmpDir, `solution.${ext}`);
      fs.writeFileSync(codePath, fullCode, 'utf8');

      // Run in Docker container
      const dockerImage = this.getDockerImage(language);
      const runCommand = this.getRunCommand(language);
      
      const dockerCmd = `docker run --rm \
        -m 128m \
        --cpus=0.5 \
        --network none \
        -v ${tmpDir}:/code:ro \
        -w /code \
        ${dockerImage} \
        timeout 5 ${runCommand}`;

      console.log(`🐳 Running: ${dockerCmd}`);

      // Execute with timeout
      const { stdout, stderr } = await execAsync(dockerCmd, {
        timeout: 6000, // 6 seconds (5s for code + 1s buffer)
        maxBuffer: 1024 * 1024, // 1MB max output
      });

      // Parse output
      const actualOutput = this.parseOutput(stdout.trim());

      // Check if test expects error
      if (expectedOutput === 'ERROR') {
        if (stderr) {
          // Code threw error as expected
          return {
            testCaseIndex: index,
            passed: true,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: '"ERROR"',
            isHidden: testCase.isHidden,
          };
        }
        // Code didn't throw error when it should have
        return {
          testCaseIndex: index,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: JSON.stringify(actualOutput),
          error: 'Expected error but code executed successfully',
          isHidden: testCase.isHidden,
        };
      }

      // Compare outputs
      const passed = this.compareOutputs(actualOutput, expectedOutput);

      return {
        testCaseIndex: index,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: JSON.stringify(actualOutput),
        isHidden: testCase.isHidden,
      };

    } catch (error: any) {
      // Check if timeout
      if (error.killed || error.signal === 'SIGTERM') {
        return {
          testCaseIndex: index,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          error: 'Time limit exceeded (5 seconds)',
          isHidden: testCase.isHidden,
        };
      }

      // Check if test expects error
      if (expectedOutput === 'ERROR' && error.stderr) {
        return {
          testCaseIndex: index,
          passed: true,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '"ERROR"',
          isHidden: testCase.isHidden,
        };
      }

      // Other error
      return {
        testCaseIndex: index,
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: '',
        error: error.stderr || error.message || 'Execution failed',
        isHidden: testCase.isHidden,
      };
    } finally {
      // Cleanup temp directory
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {
        console.error('Failed to cleanup temp dir:', e);
      }
    }
  }

  /**
   * Wrap user code with test input
   */
  private static wrapCode(code: string, input: any, language: string): string {
    if (language === 'javascript' || language === 'typescript') {
      return `
${code}

// Test execution
const input = ${JSON.stringify(input)};
let result;

// Try different function names
if (typeof validatePackageName !== 'undefined') {
  result = validatePackageName(input);
} else if (typeof resolveBuildOrder !== 'undefined') {
  result = resolveBuildOrder(input);
} else if (typeof determineBuildTargets !== 'undefined') {
  const args = Array.isArray(input) ? input : [input];
  result = determineBuildTargets(...args);
} else if (typeof solution !== 'undefined') {
  result = solution(input);
} else if (typeof solve !== 'undefined') {
  result = solve(input);
}

console.log(JSON.stringify(result));
`;
    }
    
    // Add support for other languages here
    return code;
  }

  /**
   * Get Docker image for language
   */
  private static getDockerImage(language: string): string {
    const images: Record<string, string> = {
      javascript: 'node:20-alpine',
      typescript: 'node:20-alpine',
      python: 'python:3.11-alpine',
      java: 'openjdk:17-alpine',
      cpp: 'gcc:latest',
    };
    return images[language] || 'node:20-alpine';
  }

  /**
   * Get run command for language
   */
  private static getRunCommand(language: string): string {
    const commands: Record<string, string> = {
      javascript: 'node solution.js',
      typescript: 'node solution.js', // We'd need to compile first
      python: 'python solution.py',
      java: 'javac solution.java && java Solution',
      cpp: 'g++ solution.cpp -o solution && ./solution',
    };
    return commands[language] || 'node solution.js';
  }

  /**
   * Get file extension for language
   */
  private static getFileExtension(language: string): string {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'js', // Convert to JS
      python: 'py',
      java: 'java',
      cpp: 'cpp',
    };
    return extensions[language] || 'js';
  }

  /**
   * Parse output
   */
  private static parseOutput(output: string): any {
    try {
      return JSON.parse(output);
    } catch {
      return output;
    }
  }

  /**
   * Compare outputs with deep equality
   */
  private static compareOutputs(actual: any, expected: any): boolean {
    if (typeof actual !== typeof expected) {
      return false;
    }

    if (actual === expected) {
      return true;
    }

    if (Array.isArray(actual) && Array.isArray(expected)) {
      if (actual.length !== expected.length) {
        return false;
      }
      return actual.every((val, idx) => this.compareOutputs(val, expected[idx]));
    }

    if (typeof actual === 'object' && typeof expected === 'object') {
      const actualKeys = Object.keys(actual || {}).sort();
      const expectedKeys = Object.keys(expected || {}).sort();
      
      if (actualKeys.length !== expectedKeys.length) {
        return false;
      }
      
      if (!actualKeys.every((key, idx) => key === expectedKeys[idx])) {
        return false;
      }
      
      return actualKeys.every(key => this.compareOutputs(actual[key], expected[key]));
    }

    return false;
  }
}

export default DockerJudgeService;
