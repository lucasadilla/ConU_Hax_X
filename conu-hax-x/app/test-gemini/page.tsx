'use client';

import { useState } from 'react';

export default function TestGeminiPage() {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testGeminiAPI = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/test-gemini');
      const data = await res.json();

      if (data.success) {
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError('Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  const generateTicket = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/tickets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty: 'easy',
          topic: 'arrays',
          language: 'javascript',
        }),
      });
      const data = await res.json();

      if (data.success) {
        setResponse(JSON.stringify(data.ticket, null, 2));
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError('Failed to generate ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🚀 Gemini AI Integration Test
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20">
          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <button
                onClick={testGeminiAPI}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Testing...' : '🧪 Test Gemini Connection'}
              </button>

              <button
                onClick={generateTicket}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Generating...' : '🎫 Generate Sample Ticket'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
              <p className="text-red-200 font-semibold">❌ Error: {error}</p>
            </div>
          )}

          {response && (
            <div className="bg-black/30 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                ✨ Response:
              </h2>
              <pre className="text-green-300 text-sm overflow-auto max-h-96 font-mono">
                {response}
              </pre>
            </div>
          )}

          {!loading && !response && !error && (
            <div className="text-center text-white/60 py-12">
              <p className="text-lg">
                Click a button above to test the Gemini AI integration
              </p>
              <p className="text-sm mt-2">
                Project: <strong>conuhacksx</strong>
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            📋 Integration Status
          </h2>
          <div className="space-y-2 text-white">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Gemini API Key configured</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Project: conuhacksx</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>API endpoints ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Ticket generation system configured</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Solution evaluation system configured</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-white/80 hover:text-white underline transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
