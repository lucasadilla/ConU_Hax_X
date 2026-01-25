// Service for executing code and running test cases
import { ITestCase } from '@/models/Ticket';
import { ITestResult } from '@/models/Attempt';
import { VM } from 'vm2';

export interface TestExecutionResult {
  testResults: ITestResult[];
  passed: boolean;
  passedCount: number;
  failedCount: number;
  totalCount: number;
  executionTime: number;
}

export class TestExecutionService {
  /**
   * Execute code with test cases in a sandboxed environment
   */
  static async executeTests(
    code: string,
    testCases: ITestCase[],
    language: string = 'typescript'
  ): Promise<TestExecutionResult> {
    const startTime = Date.now();
    const results: ITestResult[] = [];

    // Filter visible and hidden test cases
    const visibleTests = testCases.filter(tc => !tc.isHidden);
    const hiddenTests = testCases.filter(tc => tc.isHidden);
    const allTests = [...visibleTests, ...hiddenTests];

    for (let i = 0; i < allTests.length; i++) {
      const testCase = allTests[i];
      
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
          error: error instanceof Error ? error.message : 'Unknown error',
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
   * Run a single test case
   */
  private static async runSingleTest(
    code: string,
    testCase: ITestCase,
    language: string,
    index: number
  ): Promise<ITestResult> {
    try {
      // Parse test input
      let input: any;
      try {
        input = JSON.parse(testCase.input);
      } catch {
        input = testCase.input;
      }

      // Parse expected output
      let expectedOutput: any;
      try {
        expectedOutput = JSON.parse(testCase.expectedOutput);
      } catch {
        expectedOutput = testCase.expectedOutput;
      }

      // Prepare code for execution
      const wrappedCode = this.wrapCodeForExecution(code, input, language);
      
      // Create a sandboxed VM with console capture
      let consoleOutput: string[] = [];
      const vm = new VM({
        timeout: 5000, // 5 second timeout
        sandbox: {
          console: {
            log: (...args: any[]) => {
              consoleOutput.push(args.map(a => String(a)).join(' '));
            },
            error: (...args: any[]) => {
              consoleOutput.push('ERROR: ' + args.map(a => String(a)).join(' '));
            },
          },
        },
      });

      // Execute in sandbox
      let actualOutput: any;
      let executionError: Error | null = null;
      
      try {
        actualOutput = vm.run(wrappedCode);
      } catch (vmError: any) {
        // Check if this test expects an error
        if (expectedOutput === 'ERROR' || testCase.expectedOutput === '"ERROR"') {
          // Test expects an error, so this is a pass
          return {
            testCaseIndex: index,
            passed: true,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: '"ERROR"',
            isHidden: testCase.isHidden,
          };
        }
        
        // Unexpected execution error
        throw new Error(`Runtime error: ${vmError.message}`);
      }

      // If test expects ERROR but code didn't throw, it's a fail
      if (expectedOutput === 'ERROR' || testCase.expectedOutput === '"ERROR"') {
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

      // Format actual output for display
      let actualOutputStr: string;
      try {
        actualOutputStr = JSON.stringify(actualOutput);
      } catch {
        actualOutputStr = String(actualOutput);
      }

      return {
        testCaseIndex: index,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: actualOutputStr,
        isHidden: testCase.isHidden,
      };
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
   * Wrap user code for safe execution
   */
  private static wrapCodeForExecution(code: string, input: any, language: string): string {
    // Remove TypeScript types and annotations
    let cleanCode = code
      // Remove type annotations from parameters and variables
      .replace(/:\s*(string|number|boolean|any|void|Array|Object|Promise|Function)\b[^,;)=]*/g, '')
      // Remove interface declarations
      .replace(/interface\s+\w+\s*{[^}]*}/gs, '')
      // Remove type declarations
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
      // Remove export statements
      .replace(/export\s+(default\s+)?/g, '')
      // Remove import statements
      .replace(/import\s+.*?from\s+['"][^'"]+['"]\s*;?/g, '');

    // Wrap in IIFE to execute and return result
    return `
      'use strict';
      
      ${cleanCode}
      
      // Execute the code with the test input
      (function executeTest() {
        const input = ${JSON.stringify(input)};
        
        // Try different function patterns
        if (typeof solution !== 'undefined') {
          return solution(input);
        } else if (typeof solve !== 'undefined') {
          return solve(input);
        } else if (typeof main !== 'undefined') {
          return main(input);
        } else if (typeof validatePackageName !== 'undefined') {
          return validatePackageName(input);
        } else if (typeof resolveBuildOrder !== 'undefined') {
          return resolveBuildOrder(input);
        } else if (typeof determineBuildTargets !== 'undefined') {
          const args = Array.isArray(input) ? input : [input];
          return determineBuildTargets(...args);
        } else {
          // Try to find any function and call it
          const functions = Object.keys(this || {}).filter(key => typeof (this || {})[key] === 'function');
          if (functions.length > 0) {
            const fn = (this || {})[functions[0]];
            return fn(input);
          }
          throw new Error('No solution function found. Please export a function named: solution, solve, main, or a problem-specific function name.');
        }
      })();
    `;
  }

  /**
   * Compare actual and expected outputs
   */
  private static compareOutputs(actual: any, expected: any): boolean {
    // Deep equality check
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

  /**
   * Validate code syntax (basic check)
   */
  static validateSyntax(code: string, language: string): { valid: boolean; error?: string } {
    try {
      // Basic syntax check by attempting to create a function
      new Function(code);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Syntax error',
      };
    }
  }
}

export default TestExecutionService;
