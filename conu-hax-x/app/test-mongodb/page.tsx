'use client';

import { useState } from 'react';

interface ConnectionInfo {
  status: string;
  database: string;
  collections: {
    users: number;
    tickets: number;
    attempts: number;
    badges: number;
  };
}

export default function TestMongoDBPage() {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/test-mongodb');
      const data = await res.json();

      if (data.success) {
        setConnectionInfo(data.connection);
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setError(data.error || 'Connection failed');
      }
    } catch (err) {
      setError('Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/test-mongodb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-test-user' }),
      });
      const data = await res.json();

      if (data.success) {
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setError(data.error || 'Failed to create user');
      }
    } catch (err) {
      setError('Failed to create test user');
    } finally {
      setLoading(false);
    }
  };

  const createTestTicket = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/test-mongodb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-test-ticket' }),
      });
      const data = await res.json();

      if (data.success) {
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setError(data.error || 'Failed to create ticket');
      }
    } catch (err) {
      setError('Failed to create test ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🗄️ MongoDB Integration Test
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20">
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={testConnection}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Testing...' : '🔌 Test Connection'}
              </button>

              <button
                onClick={createTestUser}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Creating...' : '👤 Create Test User'}
              </button>

              <button
                onClick={createTestTicket}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? 'Creating...' : '🎫 Create Test Ticket'}
              </button>
            </div>
          </div>

          {connectionInfo && !error && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-6 mb-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                ✅ Connected!
              </h2>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div>
                  <p className="text-sm text-white/60">Status</p>
                  <p className="font-semibold">{connectionInfo.status}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Database</p>
                  <p className="font-semibold">{connectionInfo.database}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Users</p>
                  <p className="font-semibold">{connectionInfo.collections.users}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Tickets</p>
                  <p className="font-semibold">{connectionInfo.collections.tickets}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Attempts</p>
                  <p className="font-semibold">{connectionInfo.collections.attempts}</p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Badges</p>
                  <p className="font-semibold">{connectionInfo.collections.badges}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
              <p className="text-red-200 font-semibold">❌ Error: {error}</p>
            </div>
          )}

          {response && (
            <div className="bg-black/30 rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                📋 Response:
              </h2>
              <pre className="text-green-300 text-sm overflow-auto max-h-96 font-mono">
                {response}
              </pre>
            </div>
          )}

          {!loading && !response && !error && (
            <div className="text-center text-white/60 py-12">
              <p className="text-lg">
                Click a button above to test MongoDB integration
              </p>
              <p className="text-sm mt-2">
                Database: <strong>conuhacks</strong>
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            📊 MongoDB Models
          </h2>
          <div className="space-y-2 text-white">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>User Model</strong> - Authentication & profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Ticket Model</strong> - Coding challenges</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Attempt Model</strong> - Solution submissions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>Badge Model</strong> - Achievements & NFTs</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            🛠️ Services
          </h2>
          <div className="space-y-2 text-white">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>TicketService</strong> - Generate & manage tickets</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>EvaluationService</strong> - Evaluate solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span><strong>BadgeService</strong> - Award achievements</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-x-4">
          <a
            href="/test-gemini"
            className="text-white/80 hover:text-white underline transition-colors"
          >
            Test Gemini AI
          </a>
          <span className="text-white/40">|</span>
          <a
            href="/"
            className="text-white/80 hover:text-white underline transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
