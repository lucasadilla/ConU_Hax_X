// Runner bridge to securely execute submitted code
import vm from 'node:vm';
import type { TranspileOutput } from 'typescript';

export interface RunnerTestCase {
	input: string;
	expectedOutput: string;
	isHidden?: boolean;
}

export interface RunnerTestResult {
	testCaseIndex: number;
	passed: boolean;
	input: string;
	expectedOutput: string;
	actualOutput: string;
	error?: string;
}

export interface RunTestsOptions {
	code: string;
	language: string;
	testCases: RunnerTestCase[];
	timeoutMs?: number;
	referenceCode?: string;
	validationCode?: string;
}

const DEFAULT_TIMEOUT_MS = 1500;

const normalizeLanguage = (language?: string) => {
	const raw = (language || '').toLowerCase();
	if (raw === 'js') return 'javascript';
	if (raw === 'ts') return 'typescript';
	return raw || 'javascript';
};

const normalizePrisma = (code: string) => {
	return code
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\/\/.*$/gm, '')
		.replace(/\s+/g, '')
		.trim();
};

const normalizeText = (code: string) => {
	return code.replace(/\s+/g, ' ').trim();
};

const isJsonLike = (value: string) => {
	const trimmed = value.trim();
	return trimmed.startsWith('{') || trimmed.startsWith('[');
};

const stableStringify = (value: any): string => {
	if (Array.isArray(value)) {
		return `[${value.map(stableStringify).join(',')}]`;
	}
	if (value && typeof value === 'object') {
		const keys = Object.keys(value).sort();
		return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
	}
	return JSON.stringify(value);
};

const normalizeJson = (value: string) => {
	try {
		const parsed = JSON.parse(value);
		return stableStringify(parsed);
	} catch {
		return null;
	}
};

const extractPrismaModel = (code: string, modelName: string) => {
	const regex = new RegExp(`model\\s+${modelName}\\s*\\{([\\s\\S]*?)\\}`, 'm');
	const match = code.match(regex);
	return match ? match[1] : null;
};

const hasField = (modelBody: string, fieldRegex: RegExp) => {
	return fieldRegex.test(modelBody.replace(/\s+/g, ' '));
};

const findFunctionName = (code: string) => {
	const match = code.match(/function\s+(\w+)/) || code.match(/const\s+(\w+)\s*=\s*\(?/) || code.match(/let\s+(\w+)\s*=\s*\(?/);
	return match ? match[1] : null;
};

const shouldTranspile = (code: string, language: string) => {
	if (language === 'typescript') return true;
	return /\bexport\b|\bimport\b/.test(code);
};

const transpileIfNeeded = async (code: string, language: string) => {
	if (!shouldTranspile(code, language)) return code;
	const ts = await import('typescript');
	const output: TranspileOutput = ts.transpileModule(code, {
		compilerOptions: {
			target: ts.ScriptTarget.ES2020,
			module: ts.ModuleKind.CommonJS,
			jsx: ts.JsxEmit.ReactJSX,
		},
	});
	return output.outputText;
};

const resolveExportedFunction = (context: any, functionName: string) => {
	if (typeof context[functionName] === 'function') return context[functionName];
	if (context?.module?.exports) {
		if (typeof context.module.exports === 'function') return context.module.exports;
		if (typeof context.module.exports[functionName] === 'function') return context.module.exports[functionName];
	}
	if (context?.exports && typeof context.exports[functionName] === 'function') {
		return context.exports[functionName];
	}
	return null;
};

const runWithTimeout = async <T>(promise: Promise<T>, timeoutMs: number) => {
	let timeoutId: NodeJS.Timeout | undefined;
	const timeoutPromise = new Promise<never>((_, reject) => {
		timeoutId = setTimeout(() => reject(new Error('Execution timed out')), timeoutMs);
	});
	try {
		return await Promise.race([promise, timeoutPromise]);
	} finally {
		if (timeoutId) clearTimeout(timeoutId);
	}
};

export async function runTests({
	code,
	language,
	testCases,
	timeoutMs = DEFAULT_TIMEOUT_MS,
	referenceCode,
	validationCode,
}: RunTestsOptions): Promise<RunnerTestResult[]> {
	const results: RunnerTestResult[] = [];
	const normalized = normalizeLanguage(language);
	const supported = ['javascript', 'typescript', 'prisma', 'json', 'mongodb', 'react', 'nextjs'];

	if (!supported.includes(normalized)) {
		return testCases.map((testCase, index) => ({
			testCaseIndex: index,
			passed: false,
			input: testCase.input,
			expectedOutput: testCase.expectedOutput,
			actualOutput: '',
			error: `Language not supported for execution: ${language}`,
		}));
	}

	if (validationCode) {
		try {
			const userJs = await transpileIfNeeded(code, normalized);
			const validatorJs = await transpileIfNeeded(validationCode, normalized);
			const context = vm.createContext({
				console: { log: () => null, error: () => null },
				JSON,
				module: { exports: {} },
				exports: {},
			});

			const userScript = new vm.Script(userJs, { filename: 'user-code.js' });
			userScript.runInContext(context, { timeout: timeoutMs });

			const validatorScript = new vm.Script(validatorJs, { filename: 'validation-code.js' });
			validatorScript.runInContext(context, { timeout: timeoutMs });

			const validatorFn =
				resolveExportedFunction(context, 'validate') ||
				resolveExportedFunction(context, 'runTests') ||
				(typeof (context as any).validate === 'function' ? (context as any).validate : null);

			if (!validatorFn) {
				return testCases.map((testCase, index) => ({
					testCaseIndex: index,
					passed: false,
					input: testCase.input,
					expectedOutput: testCase.expectedOutput,
					actualOutput: '',
					error: 'Validation code must export a validate() or runTests() function.',
				}));
			}

			const raw = await runWithTimeout(Promise.resolve(validatorFn({
				testCases,
				language: normalized,
			})), timeoutMs);

			const results = Array.isArray(raw)
				? raw
				: Array.isArray(raw?.results)
					? raw.results
					: null;

			if (!results) {
				return testCases.map((testCase, index) => ({
					testCaseIndex: index,
					passed: false,
					input: testCase.input,
					expectedOutput: testCase.expectedOutput,
					actualOutput: '',
					error: 'Validation code returned invalid results.',
				}));
			}

			return results.map((result: any, index: number) => ({
				testCaseIndex: typeof result.testCaseIndex === 'number' ? result.testCaseIndex : index,
				passed: !!result.passed,
				input: result.input ?? testCases[index]?.input ?? '',
				expectedOutput: result.expectedOutput ?? testCases[index]?.expectedOutput ?? '',
				actualOutput: result.actualOutput ?? '',
				error: result.error,
			}));
		} catch (error) {
			return testCases.map((testCase, index) => ({
				testCaseIndex: index,
				passed: false,
				input: testCase.input,
				expectedOutput: testCase.expectedOutput,
				actualOutput: '',
				error: error instanceof Error ? error.message : 'Validation error',
			}));
		}
	}

	if (normalized === 'prisma') {
		const normalizedUser = normalizePrisma(code);
		return testCases.map((testCase, index) => {
			const expected = testCase.expectedOutput || '';
			if (!expected) {
				return {
					testCaseIndex: index,
					passed: false,
					input: testCase.input,
					expectedOutput: expected,
					actualOutput: '',
					error: 'No expected output provided for prisma test case.',
				};
			}

			if (expected.trim() === 'true') {
				const tagModel = extractPrismaModel(code, 'Tag');
				const taskModel = extractPrismaModel(code, 'Task');

				const tagValid = !!tagModel &&
					hasField(tagModel, /id\s+String\s+@id/) &&
					hasField(tagModel, /name\s+String\s+@unique/) &&
					hasField(tagModel, /tasks\s+Task\[\]/);

				const taskValid = !!taskModel && hasField(taskModel, /tags\s+Tag\[\]/);

				const passed = tagValid && taskValid;

				return {
					testCaseIndex: index,
					passed,
					input: testCase.input,
					expectedOutput: expected,
					actualOutput: passed ? 'true' : 'false',
					error: passed
						? undefined
						: 'Schema must define model Tag with id/name/tasks and add tags Tag[] to Task.',
				};
			}

			const normalizedExpected = normalizePrisma(expected);
			const passed = normalizedUser === normalizedExpected;

			return {
				testCaseIndex: index,
				passed,
				input: testCase.input,
				expectedOutput: expected,
				actualOutput: passed ? expected : 'Schema does not match expected output.',
			};
		});
	}

	if (['json', 'mongodb'].includes(normalized)) {
		const normalizedUser = normalizeJson(code);
		return testCases.map((testCase, index) => {
			const expected = testCase.expectedOutput || '';
			const normalizedExpected = normalizeJson(expected);
			const passed = !!normalizedUser && !!normalizedExpected && normalizedUser === normalizedExpected;

			return {
				testCaseIndex: index,
				passed,
				input: testCase.input,
				expectedOutput: expected,
				actualOutput: normalizedUser || '',
				error: passed ? undefined : 'JSON output does not match expected snapshot.',
			};
		});
	}

	if (['react', 'nextjs'].includes(normalized)) {
		const normalizedUser = normalizeText(code);
		return testCases.map((testCase, index) => {
			const expected = testCase.expectedOutput || '';
			const comparisonTarget = expected.trim() === 'true' && referenceCode
				? referenceCode
				: expected;
			const normalizedExpected = normalizeText(comparisonTarget);
			const passed = normalizedUser === normalizedExpected;

			return {
				testCaseIndex: index,
				passed,
				input: testCase.input,
				expectedOutput: expected,
				actualOutput: normalizedUser,
				error: passed ? undefined : 'Snapshot mismatch for React/Next.js output.',
			};
		});
	}

	const functionName = findFunctionName(code);
	if (!functionName) {
		const normalizedUserJson = normalizeJson(code);
		return testCases.map((testCase, index) => {
			const expected = testCase.expectedOutput || '';
			if (isJsonLike(expected) && normalizedUserJson) {
				const normalizedExpected = normalizeJson(expected);
				const passed = !!normalizedExpected && normalizedUserJson === normalizedExpected;
				return {
					testCaseIndex: index,
					passed,
					input: testCase.input,
					expectedOutput: expected,
					actualOutput: normalizedUserJson,
					error: passed ? undefined : 'JSON output does not match expected snapshot.',
				};
			}

			const comparisonTarget = expected.trim() === 'true' && referenceCode
				? referenceCode
				: expected;
			const passed = normalizeText(code) === normalizeText(comparisonTarget);
			return {
				testCaseIndex: index,
				passed,
				input: testCase.input,
				expectedOutput: expected,
				actualOutput: normalizeText(code),
				error: passed ? undefined : 'Could not find a function to test and snapshot did not match.',
			};
		});
	}

	const jsCode = await transpileIfNeeded(code, normalized);
	const context = vm.createContext({
		console: { log: () => null, error: () => null },
		JSON,
		module: { exports: {} },
		exports: {},
	});
	const script = new vm.Script(jsCode, { filename: 'user-code.js' });

	script.runInContext(context, { timeout: timeoutMs });

	const fn = resolveExportedFunction(context, functionName);
	if (typeof fn !== 'function') {
		return testCases.map((testCase, index) => ({
			testCaseIndex: index,
			passed: false,
			input: testCase.input,
			expectedOutput: testCase.expectedOutput,
			actualOutput: '',
			error: `Function ${functionName} is not defined in the submitted code.`,
		}));
	}

	let referenceFn: ((...args: any[]) => any) | null = null;
	if (referenceCode) {
		try {
			const refName = findFunctionName(referenceCode) || functionName;
			const refCode = await transpileIfNeeded(referenceCode, normalized);
			const refContext = vm.createContext({
				console: { log: () => null, error: () => null },
				JSON,
				module: { exports: {} },
				exports: {},
			});
			const refScript = new vm.Script(refCode, { filename: 'reference-code.js' });
			refScript.runInContext(refContext, { timeout: timeoutMs });
			const refFn = resolveExportedFunction(refContext, refName);
			if (typeof refFn === 'function') {
				referenceFn = refFn;
			}
		} catch {
			referenceFn = null;
		}
	}

	for (let i = 0; i < testCases.length; i++) {
		const testCase = testCases[i];
		try {
			const parsed = (() => {
				try {
					return JSON.parse(testCase.input);
				} catch {
					return testCase.input;
				}
			})();

			const args = Array.isArray(parsed) ? parsed : [parsed];
			const result = await runWithTimeout(Promise.resolve(fn(...args)), timeoutMs);

			let expected = testCase.expectedOutput;
			if (referenceFn) {
				try {
					const referenceResult = await runWithTimeout(Promise.resolve(referenceFn(...args)), timeoutMs);
					expected = JSON.stringify(referenceResult);
				} catch {
					// Fallback to expectedOutput when reference fails
				}
			}

			const actual = JSON.stringify(result);
			const passed = actual === expected || result?.toString?.() === expected;

			results.push({
				testCaseIndex: i,
				passed,
				input: testCase.input,
				expectedOutput: expected,
				actualOutput: actual,
			});
		} catch (error) {
			results.push({
				testCaseIndex: i,
				passed: false,
				input: testCase.input,
				expectedOutput: testCase.expectedOutput,
				actualOutput: '',
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	}

	return results;
}
