'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

/**
 * Phantom Wallet Debug/Test Page
 * Access at: /phantom-test
 */
export default function PhantomTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isDetected, setIsDetected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const checkPhantom = () => {
    setLogs([]);
    addLog('🔍 Checking for Phantom...');
    
    const provider = (window as any).solana;
    
    if (!provider) {
      addLog('❌ window.solana not found');
      addLog('   Solution: Install Phantom from phantom.app');
      setIsDetected(false);
      return;
    }
    
    addLog('✅ window.solana exists');
    
    // Check all properties
    addLog('📋 Provider Properties:');
    addLog(`   isPhantom: ${provider.isPhantom}`);
    addLog(`   isConnected: ${provider.isConnected}`);
    addLog(`   publicKey: ${provider.publicKey?.toString() || 'null'}`);
    
    // Check available methods
    addLog('📋 Available Methods:');
    const methods = ['connect', 'disconnect', 'signTransaction', 'signMessage'];
    methods.forEach(method => {
      addLog(`   ${method}: ${typeof provider[method]}`);
    });
    
    // Check constructor
    if (provider.constructor) {
      addLog(`📋 Constructor: ${provider.constructor.name}`);
    }
    
    // Check if locked
    try {
      if (provider._handleDisconnect) {
        addLog('📋 Phantom internal state detected');
      }
    } catch (e) {
      // Ignore
    }
    
    // Test simple call
    addLog('🧪 Testing basic functionality...');
    try {
      const testVal = provider.isPhantom;
      addLog(`   ✅ Can read isPhantom: ${testVal}`);
    } catch (e: any) {
      addLog(`   ❌ Error reading properties: ${e.message}`);
    }
    
    setIsDetected(provider.isPhantom);
    setIsConnected(provider.isConnected);
    setWalletAddress(provider.publicKey?.toString() || null);
    
    if (provider.isPhantom) {
      addLog('✅ Phantom is ready!');
      if (provider.isConnected) {
        addLog('✅ Already connected!');
      } else {
        addLog('📝 Status: Not connected (click Test Connect)');
      }
    } else {
      addLog('❌ Not a Phantom wallet');
    }
  };

  const testConnect = async () => {
    addLog('🔗 Attempting connection...');
    setIsTesting(true);
    
    try {
      const provider = (window as any).solana;
      
      if (!provider) {
        addLog('❌ ERROR: No provider found');
        addLog('   Fix: Install Phantom from phantom.app');
        return;
      }
      
      if (!provider.isPhantom) {
        addLog('❌ ERROR: Provider is not Phantom');
        addLog('   Found: ' + (provider.constructor?.name || 'unknown'));
        return;
      }
      
      addLog('📱 Calling provider.connect()...');
      addLog('   Please approve in Phantom popup...');
      
      // Try to connect with detailed error catching
      let resp;
      try {
        resp = await provider.connect();
      } catch (connectError: any) {
        addLog('❌ CONNECT ERROR CAUGHT:');
        addLog(`   Message: ${connectError.message || 'none'}`);
        addLog(`   Code: ${connectError.code || 'none'}`);
        addLog(`   Name: ${connectError.name || 'none'}`);
        addLog(`   Type: ${typeof connectError}`);
        
        // Try to stringify the error
        try {
          addLog(`   JSON: ${JSON.stringify(connectError, null, 2)}`);
        } catch {
          addLog('   (Could not stringify error)');
        }
        
        // Log all error properties
        addLog('   All properties:');
        for (const key in connectError) {
          try {
            addLog(`     ${key}: ${connectError[key]}`);
          } catch {
            addLog(`     ${key}: (cannot display)`);
          }
        }
        
        // Check error constructor
        if (connectError.constructor) {
          addLog(`   Constructor: ${connectError.constructor.name}`);
        }
        
        // Check error prototype
        if (connectError.prototype) {
          addLog(`   Prototype: ${Object.keys(connectError.prototype).join(', ')}`);
        }
        
        throw connectError;
      }
      
      addLog('✅ Connection successful!');
      
      if (!resp) {
        addLog('⚠️  WARNING: Response is null/undefined');
        return;
      }
      
      if (!resp.publicKey) {
        addLog('⚠️  WARNING: No publicKey in response');
        addLog(`   Response: ${JSON.stringify(resp)}`);
        return;
      }
      
      const address = resp.publicKey.toString();
      addLog(`   Public Key: ${address}`);
      addLog(`   Short: ${address.substring(0, 8)}...${address.substring(address.length - 8)}`);
      
      setIsConnected(true);
      setWalletAddress(address);
      
      addLog('✅ ALL CHECKS PASSED!');
      
    } catch (error: any) {
      addLog('❌ OUTER ERROR CAUGHT:');
      addLog(`   Message: ${error?.message || 'No message'}`);
      addLog(`   Code: ${error?.code || 'No code'}`);
      addLog(`   Name: ${error?.name || 'No name'}`);
      addLog(`   Stack trace:`);
      
      if (error?.stack) {
        const stackLines = error.stack.split('\n');
        stackLines.slice(0, 5).forEach((line: string) => {
          addLog(`     ${line.trim()}`);
        });
      } else {
        addLog('     (No stack trace available)');
      }
      
      // Full error object
      console.error('Full error object:', error);
      console.error('Error keys:', Object.keys(error || {}));
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
    } finally {
      setIsTesting(false);
    }
  };

  const testDisconnect = async () => {
    addLog('🔌 Attempting disconnect...');
    
    try {
      const provider = (window as any).solana;
      await provider.disconnect();
      
      addLog('✅ Disconnected');
      setIsConnected(false);
      setWalletAddress(null);
    } catch (error: any) {
      addLog(`❌ Disconnect failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 
          className="text-4xl font-display mb-4 text-center"
          style={{ 
            color: '#fde047',
            textShadow: '3px 3px 0 rgba(0,0,0,0.5)',
          }}
        >
          Phantom Wallet Debug Tool
        </h1>

        <p className="text-center text-slate-300 mb-8">
          Use this page to test and debug Phantom wallet connection issues
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div 
            className="p-4 rounded-lg text-center"
            style={{
              backgroundColor: isDetected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: isDetected ? '3px solid #22c55e' : '3px solid #ef4444',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            <div className="text-2xl mb-2">{isDetected ? '✅' : '❌'}</div>
            <div className="text-sm font-bold text-white">Phantom Detected</div>
            <div className="text-xs text-slate-400">{isDetected ? 'Installed' : 'Not Found'}</div>
          </div>

          <div 
            className="p-4 rounded-lg text-center"
            style={{
              backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(253, 224, 71, 0.1)',
              border: isConnected ? '3px solid #22c55e' : '3px solid #fde047',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            <div className="text-2xl mb-2">{isConnected ? '🔗' : '🔌'}</div>
            <div className="text-sm font-bold text-white">Connection</div>
            <div className="text-xs text-slate-400">{isConnected ? 'Connected' : 'Disconnected'}</div>
          </div>

          <div 
            className="p-4 rounded-lg text-center"
            style={{
              backgroundColor: walletAddress ? 'rgba(34, 197, 94, 0.1)' : 'rgba(148, 163, 184, 0.1)',
              border: walletAddress ? '3px solid #22c55e' : '3px solid #94a3b8',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            <div className="text-2xl mb-2">{walletAddress ? '💼' : '⏳'}</div>
            <div className="text-sm font-bold text-white">Wallet Address</div>
            <div className="text-xs text-slate-400 font-mono break-all">
              {walletAddress ? `${walletAddress.substring(0, 8)}...` : 'None'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={checkPhantom}
            className="px-4 py-3 font-bold text-black bg-yellow-400 border-4 border-black hover:bg-yellow-300 transition-colors"
            style={{ boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.5)' }}
          >
            🔍 Check Phantom
          </button>

          <button
            onClick={testConnect}
            disabled={!isDetected || isTesting}
            className="px-4 py-3 font-bold text-black bg-green-400 border-4 border-black hover:bg-green-300 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            style={{ boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.5)' }}
          >
            {isTesting ? '⏳ Testing...' : '🔗 Test Connect'}
          </button>

          <button
            onClick={testDisconnect}
            disabled={!isConnected}
            className="px-4 py-3 font-bold text-black bg-red-400 border-4 border-black hover:bg-red-300 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            style={{ boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.5)' }}
          >
            🔌 Disconnect
          </button>
        </div>

        {/* Console Logs */}
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: 'rgba(30, 30, 46, 0.9)',
            border: '3px solid #1e1e2e',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          }}
        >
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Console Output</h2>
          
          {logs.length === 0 ? (
            <p className="text-slate-400 text-sm italic">
              Click "Check Phantom" to start...
            </p>
          ) : (
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="text-xs font-mono text-slate-300 bg-black/30 p-2 rounded"
                >
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div
          className="mt-8 p-6 rounded-lg"
          style={{
            backgroundColor: 'rgba(253, 224, 71, 0.1)',
            border: '3px solid #fde047',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          }}
        >
          <h2 className="text-xl font-bold text-yellow-400 mb-4">How to Use</h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p><strong>1. Check Phantom:</strong> Verifies Phantom is installed and checks its state</p>
            <p><strong>2. Test Connect:</strong> Attempts to connect to Phantom (popup should appear)</p>
            <p><strong>3. Disconnect:</strong> Disconnects the wallet</p>
            <p className="text-yellow-400 mt-4"><strong>💡 Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Open browser console (F12) for full error details</li>
              <li>Make sure Phantom is unlocked before testing</li>
              <li>Click "Approve" in the Phantom popup</li>
              <li>Check console logs above for detailed information</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
