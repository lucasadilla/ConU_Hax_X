// Simple code executor using Node.js VM (no dependencies needed)
import { ITestCase } from '@/models/Ticket';
import { ITestResult } from '@/models/Attempt';
import vm from 'vm';

export interface ExecutionResult {
  testResults: ITestResult[];
  passed: boolean;
  passedCount: number;
  failedCount: number;
  totalCount: number;
  executionTime: number;
}

export class SimpleExecutor {
  /**
   * Execute code with test cases using Node.js VM
   */
  static async executeTests(
    code: string,
    testCases: ITestCase[],
    language: string = 'javascript'
  ): Promise<ExecutionResult> {
    console.log(`🔍 SimpleExecutor: Running ${testCases.length} test cases...`);
    console.log(`📝 Code length: ${code.length} characters`);
    
    const startTime = Date.now();
    const results: ITestResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n🧪 Test ${i + 1}/${testCases.length}`);
      
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

        // Wrap user code with test execution
        const wrappedCode = `
          'use strict';
          
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
          } else {
            throw new Error('No solution function found. Define validatePackageName, resolveBuildOrder, determineBuildTargets, solution, solve, or main');
          }
          
          result;
        `;

        // Create sandbox context
        const context = vm.createContext({
          console: {
            log: (...args: any[]) => {}, // Suppress console.log
          },
        });

        // Run code in sandbox with timeout
        let actualOutput: any;
        try {
          actualOutput = vm.runInContext(wrappedCode, context, {
            timeout: 5000, // 5 second timeout
            displayErrors: true,
          });
        } catch (vmError: any) {
          // Check if test expects an error
          if (expectedOutput === 'ERROR') {
            console.log(`   ✅ PASSED (expected error)`);
            results.push({
              testCaseIndex: i,
              passed: true,
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              actualOutput: '"ERROR"',
              isHidden: testCase.isHidden,
            });
            continue;
          }
          
          throw vmError;
        }

        // If test expects ERROR but code didn't throw
        if (expectedOutput === 'ERROR') {
          console.log(`   ❌ FAILED (expected error but got result)`);
          results.push({
            testCaseIndex: i,
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: JSON.stringify(actualOutput),
            error: 'Expected error but code executed successfully',
            isHidden: testCase.isHidden,
          });
          continue;
        }

        // Compare outputs
        const passed = this.compareOutputs(actualOutput, expectedOutput);
        
        console.log(`   ${passed ? '✅ PASSED' : '❌ FAILED'}`);
        if (!passed) {
          console.log(`   Expected: ${JSON.stringify(expectedOutput)}`);
          console.log(`   Actual: ${JSON.stringify(actualOutput)}`);
        }

        results.push({
          testCaseIndex: i,
          passed,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: JSON.stringify(actualOutput),
          isHidden: testCase.isHidden,
        });

      } catch (error: any) {
        console.log(`   ❌ ERROR: ${error.message}`);
        
        // Check if test expects an error
        let expectedOutput: any;
        try {
          expectedOutput = JSON.parse(testCase.expectedOutput);
        } catch {
          expectedOutput = testCase.expectedOutput;
        }

        if (expectedOutput === 'ERROR') {
          results.push({
            testCaseIndex: i,
            passed: true,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: '"ERROR"',
            isHidden: testCase.isHidden,
          });
        } else {
          results.push({
            testCaseIndex: i,
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: '',
            error: error.message || 'Execution error',
            isHidden: testCase.isHidden,
          });
        }
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

    if (typeof actual === 'object' && typeof expected === 'object' && actual !== null && expected !== null) {
      const actualKeys = Object.keys(actual).sort();
      const expectedKeys = Object.keys(expected).sort();
      
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

export default SimpleExecutor;
