'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader2, CheckCircle } from 'lucide-react';

export default function AddNFTMetadataPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const addMetadata = async () => {
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/quests/add-nft-metadata', {
        method: 'POST',
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 
          className="text-4xl font-display mb-8 text-center"
          style={{ 
            color: '#fde047',
            textShadow: '3px 3px 0 rgba(0,0,0,0.5)',
          }}
        >
          Add NFT Metadata to Quests
        </h1>

        <div
          className="p-6 rounded-lg mb-8"
          style={{
            backgroundColor: 'rgba(253, 224, 71, 0.1)',
            border: '3px solid #fde047',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          }}
        >
          <h2 className="text-xl font-bold text-yellow-400 mb-4">What This Does</h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p>✅ Adds NFT metadata to all existing quests</p>
            <p>✅ Sets NFT name, description, image URL</p>
            <p>✅ Creates attributes (theme, difficulty, points)</p>
            <p>✅ Links to badge SVG images</p>
            <p className="mt-4 text-yellow-400">⚠️ This will update ALL quests in the database</p>
          </div>
        </div>

        <button
          onClick={addMetadata}
          disabled={loading}
          className="w-full px-4 py-3 font-bold text-black bg-yellow-400 border-4 border-black hover:bg-yellow-300 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors mb-8"
          style={{ boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.5)' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Adding Metadata...
            </span>
          ) : (
            '🎨 Add NFT Metadata to All Quests'
          )}
        </button>

        {results && (
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: results.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: results.success ? '3px solid #22c55e' : '3px solid #ef4444',
              boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              {results.success ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <span className="text-2xl">❌</span>
              )}
              <h3 className="text-xl font-bold text-white">
                {results.success ? 'Success!' : 'Error'}
              </h3>
            </div>

            {results.success ? (
              <>
                <p className="text-green-400 mb-4">{results.message}</p>
                
                {results.updates && results.updates.length > 0 && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    <h4 className="font-bold text-white mb-2">Updated Quests:</h4>
                    {results.updates.map((update: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 bg-black/30 rounded text-xs"
                      >
                        <div className="text-yellow-400 font-bold mb-1">{update.title}</div>
                        <div className="text-slate-400">NFT: {update.nftName}</div>
                        <div className="text-slate-500 font-mono">{update.imageUrl}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-400">Error: {results.error}</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
