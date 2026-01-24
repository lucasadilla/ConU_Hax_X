'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function SeedQuestsPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const generateQuests = async () => {
    setLoading(true);
    setResults([]);
    setSummary(null);

    try {
      const response = await fetch('/api/quests/seed');
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setSummary(data.summary);
      } else {
        alert('Failed to generate quests: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary">
            🔧 Admin Tool
          </Badge>
          <h1 className="font-display text-3xl text-primary mb-4">
            Generate All 9 Quests
          </h1>
          <p className="text-muted-foreground">
            This will use Gemini AI to generate 9 quests (3 per theme).
            Takes approximately 60 seconds.
          </p>
        </div>

        <Card className="p-8 mb-8">
          <div className="text-center">
            <Button
              onClick={generateQuests}
              disabled={loading}
              size="lg"
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                '🚀 Generate Quests'
              )}
            </Button>
            
            {loading && (
              <p className="text-sm text-muted-foreground mt-4">
                This may take 60-90 seconds...
              </p>
            )}
          </div>
        </Card>

        {/* Summary */}
        {summary && (
          <Card className="p-6 mb-6 border-2 border-primary">
            <h2 className="text-xl font-display text-primary mb-4">Summary</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-foreground">{summary.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500">{summary.successful}</div>
                <div className="text-sm text-muted-foreground">Success</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-500">{summary.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
          </Card>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-display text-primary mb-4">
              Generated Quests
            </h2>
            {results.map((result, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <div className="font-semibold text-foreground">
                        {result.success ? result.title : `${result.theme} #${result.questNumber}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.theme} • Quest {result.questNumber}
                        {result.success && ` • ${result.stages} stages`}
                      </div>
                      {!result.success && result.error && (
                        <div className="text-xs text-red-400 mt-1">{result.error}</div>
                      )}
                    </div>
                  </div>
                  
                  <Badge
                    variant="outline"
                    className={
                      result.theme === 'regression'
                        ? 'border-red-500 text-red-400'
                        : result.theme === 'feature-creation'
                        ? 'border-green-500 text-green-400'
                        : 'border-yellow-500 text-yellow-400'
                    }
                  >
                    {result.theme}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {summary && (
          <div className="text-center mt-8">
            <a href="/quests">
              <Button size="lg">
                View Quests
              </Button>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
