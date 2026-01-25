// Service for executing code using Judge0 API
// Judge0 is an open-source code execution system used by competitive programming platforms

import { ITestCase } from '@/models/Ticket';
import { ITestResult } from '@/models/Attempt';

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || '';

// Language IDs for Judge0
const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  typescript: 74,  // TypeScript
  python: 71,      // Python 3
  java: 62,        // Java
  cpp: 54,         // C++
};

export interface Judge0ExecutionResult {
  testResults: ITestResult[];
  passed: boolean;
  passedCount: number;
  failedCount: number;
  totalCount: number;
  executionTime: number;
}

export class Judge0Service {
  /**
   * Execute code with test cases using Judge0
   */
  static async executeTests(
    code: string,
    testCases: ITestCase[],
    language: string = 'javascript'
  ): Promise<Judge0ExecutionResult> {
    console.log(`🔍 Judge0: Executing ${testCases.length} test cases...`);
    console.log(`📝 Code length: ${code.length} characters`);
    
    const startTime = Date.now();
    const results: ITestResult[] = [];

    // Get language ID
    const languageId = LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS] || LANGUAGE_IDS.javascript;
    console.log(`🌐 Using language ID: ${languageId} (${language})`);

    // Run each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n🧪 Running test case ${i + 1}/${testCases.length}...`);
      
      try {
        const result = await this.runSingleTest(code, testCase, languageId, i);
        console.log(`   ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
        if (!result.passed && result.error) {
          console.log(`   Error: ${result.error}`);
        }
        results.push(result);
      } catch (error) {
        console.log(`   ❌ EXCEPTION: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

    console.log(`\n📊 Results: ${passedCount}/${results.length} passed (${executionTime}ms)`);

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
   * Run a single test case
   */
  private static async runSingleTest(
    code: string,
    testCase: ITestCase,
    languageId: number,
    index: number
  ): Promise<ITestResult> {
    try {
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

      // Prepare code with test input
      const fullCode = this.wrapCodeForJudge0(code, input);

      // Submit to Judge0
      const submission = await this.submitToJudge0(fullCode, languageId);
      
      // Wait for result
      const result = await this.waitForResult(submission.token);

      // Check if execution was successful
      if (result.status.id === 3) {
        // Accepted - parse output
        const actualOutput = this.parseOutput(result.stdout?.trim() || '');
        
        // Check if test expects an error
        if (expectedOutput === 'ERROR') {
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
      } else if (result.status.id === 5) {
        // Time Limit Exceeded
        return {
          testCaseIndex: index,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          error: 'Time limit exceeded (5 seconds)',
          isHidden: testCase.isHidden,
        };
      } else if (result.status.id === 6) {
        // Compilation Error
        return {
          testCaseIndex: index,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          error: `Compilation error: ${result.compile_output || 'Unknown error'}`,
          isHidden: testCase.isHidden,
        };
      } else if (result.status.id === 11 || result.status.id === 12) {
        // Runtime Error
        // If test expects ERROR, this is a pass
        if (expectedOutput === 'ERROR') {
          return {
            testCaseIndex: index,
            passed: true,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: '"ERROR"',
            isHidden: testCase.isHidden,
          };
        }

        return {
          testCaseIndex: index,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          error: `Runtime error: ${result.stderr || 'Unknown error'}`,
          isHidden: testCase.isHidden,
        };
      } else {
        // Other error
        return {
          testCaseIndex: index,
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: '',
          error: result.status.description || 'Execution failed',
          isHidden: testCase.isHidden,
        };
      }
    } catch (error) {
      return {
        testCaseIndex: index,
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: '',
        error: error instanceof Error ? error.message : 'Execution error',
        isHidden: testCase.isHidden,
      };
    }
  }

  /**
   * Wrap code for Judge0 execution
   */
  private static wrapCodeForJudge0(code: string, input: any): string {
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
} else if (typeof main !== 'undefined') {
  result = main(input);
}

// Output result as JSON
console.log(JSON.stringify(result));
`;
  }

  /**
   * Submit code to Judge0 API
   */
  private static async submitToJudge0(code: string, languageId: number): Promise<any> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Only add RapidAPI headers if using RapidAPI URL
    if (JUDGE0_API_URL.includes('rapidapi') && JUDGE0_API_KEY) {
      headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
      headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
    }

    const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: '',
        cpu_time_limit: 5,
        memory_limit: 128000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Judge0 submission failed: ${response.statusText}. ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Wait for Judge0 result with polling
   */
  private static async waitForResult(token: string, maxAttempts: number = 20): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const headers: HeadersInit = {};

      // Only add RapidAPI headers if using RapidAPI URL
      if (JUDGE0_API_URL.includes('rapidapi') && JUDGE0_API_KEY) {
        headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
        headers['X-RapidAPI-Host'] = 'judge0-ce.p.rapidapi.com';
      }

      const response = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to get result: ${response.statusText}`);
      }

      const result = await response.json();

      // Status IDs: 1-2 = In Queue/Processing, 3+ = Done
      if (result.status.id > 2) {
        return result;
      }

      // Wait 500ms before next poll
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    throw new Error('Execution timeout - result not available');
  }

  /**
   * Parse output from Judge0
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

export default Judge0Service;
