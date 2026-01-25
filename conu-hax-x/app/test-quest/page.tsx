'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TestQuestPage() {
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(true);
    try {
      const result = await testFn();
      setOutput(prev => prev + `\n✅ ${testName}: ${JSON.stringify(result, null, 2)}\n`);
    } catch (error: any) {
      setOutput(prev => prev + `\n❌ ${testName}: ${error.message}\n`);
    }
    setLoading(false);
  };

  // Test 1: Submit Stage 1 with correct solution
  const testStage1Success = async () => {
    const correctSolution = `function validatePackageName(name) {
  // Check if name matches @projectnexus/* pattern
  const regex = /^@projectnexus\/[a-z0-9-]+$/;
  return regex.test(name);
}`;

    const response = await fetch('/api/quest/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId: 'TICKET_ID_HERE', // Will be replaced after seeding
        questId: 'QUEST_ID_HERE',
        stageIndex: 0,
        code: correctSolution,
        language: 'javascript',
        timeSpent: 600,
      }),
    });

    return await response.json();
  };

  // Test 2: Try to access Stage 2 before completing Stage 1
  const testLockedStage = async () => {
    const response = await fetch('/api/quest/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId: 'STAGE2_TICKET_ID_HERE',
        questId: 'QUEST_ID_HERE',
        stageIndex: 1,
        code: 'function test() { return true; }',
        language: 'javascript',
        timeSpent: 60,
      }),
    });

    return await response.json();
  };

  // Test 3: Submit Stage 1 with wrong solution
  const testStage1Failure = async () => {
    const wrongSolution = `function validatePackageName(name) {
  // Wrong: accepts everything
  return true;
}`;

    const response = await fetch('/api/quest/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketId: 'TICKET_ID_HERE',
        questId: 'QUEST_ID_HERE',
        stageIndex: 0,
        code: wrongSolution,
        language: 'javascript',
        timeSpent: 300,
      }),
    });

    return await response.json();
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>🧪 Quest System Test Suite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h3 className="font-bold text-yellow-800 mb-2">⚠️ Setup Required</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                <li>Run: <code className="bg-yellow-100 px-2 py-1 rounded">npx tsx scripts/seed-project-nexus.ts</code></li>
                <li>Copy the Quest ID and Ticket IDs from the output</li>
                <li>Update the IDs in this file: <code className="bg-yellow-100 px-2 py-1 rounded">app/test-quest/page.tsx</code></li>
                <li>Refresh this page and run the tests</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg">Test Cases:</h3>
              
              <Button
                onClick={() => runTest('Submit Stage 1 with correct solution', testStage1Success)}
                disabled={loading}
                className="w-full"
              >
                Test 1: Complete Stage 1 (Should Pass & Unlock Stage 2)
              </Button>

              <Button
                onClick={() => runTest('Try accessing locked Stage 2', testLockedStage)}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Test 2: Try Locked Stage 2 (Should Fail)
              </Button>

              <Button
                onClick={() => runTest('Submit Stage 1 with wrong solution', testStage1Failure)}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Test 3: Fail Stage 1 (Tests Should Fail)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-xs font-mono">
            {output || 'Run a test to see output...'}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
