'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PhantomWalletConnectProps {
  userId: string;
  onConnected?: (walletAddress: string, claimedNFTs: number) => void;
}

export function PhantomWalletConnect({ userId, onConnected }: PhantomWalletConnectProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection();
  }, [userId]);

  const checkWalletConnection = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/connect-wallet?userId=${userId}`);
      const data = await response.json();
      
      if (data.isConnected) {
        setWalletAddress(data.walletAddress);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setError(null);
    setClaimMessage(null);
    setIsConnecting(true);

    try {
      // Check if Phantom is installed
      const provider = (window as any).solana;
      
      if (!provider) {
        setError('No Solana wallet found. Please install Phantom from phantom.app');
        setIsConnecting(false);
        return;
      }

      if (!provider.isPhantom) {
        setError('Please use Phantom wallet. Install from phantom.app');
        setIsConnecting(false);
        return;
      }

      console.log('📱 Phantom detected, attempting connection...');
      
      // Try to connect to Phantom
      let publicKey: string;
      
      try {
        // Check if already connected
        if (provider.isConnected && provider.publicKey) {
          publicKey = provider.publicKey.toString();
          console.log('✅ Using existing connection:', publicKey.substring(0, 8) + '...');
        } else {
          // Disconnect first to ensure clean state
          try {
            await provider.disconnect();
          } catch (e) {
            // Ignore disconnect errors
          }
          
          console.log('🔄 Requesting new connection from Phantom...');
          console.log('⏳ Please approve the connection in Phantom popup...');
          
          // Simple connection without options (most compatible)
          const resp = await provider.connect();
          
          if (!resp || !resp.publicKey) {
            throw new Error('No wallet address received from Phantom');
          }
          
          publicKey = resp.publicKey.toString();
          console.log('✅ Connected successfully:', publicKey.substring(0, 8) + '...');
        }
      } catch (phantomError: any) {
        console.error('❌ Phantom error:', phantomError);
        
        // Log detailed error info
        console.error('Error details:', {
          message: phantomError?.message,
          code: phantomError?.code,
          name: phantomError?.name,
          toString: phantomError?.toString?.()
        });
        
        // Handle specific error cases
        if (phantomError.code === 4001) {
          throw new Error('You rejected the connection. Please try again and click "Connect".');
        }
        
        if (phantomError.message?.includes('User rejected')) {
          throw new Error('Connection cancelled. Please try again and approve in Phantom.');
        }
        
        // For generic errors, provide helpful instructions
        if (phantomError.message === 'Unexpected error' || !phantomError.message) {
          throw new Error(
            'Phantom connection failed. Try: 1) Refresh this page, 2) Unlock Phantom, 3) Try again.'
          );
        }
        
        throw new Error(`Connection failed: ${phantomError.message}`);
      }

      if (!publicKey) {
        throw new Error('Failed to get wallet address. Please try again.');
      }

      console.log('📤 Sending wallet address to backend...');

      // Send wallet address to backend
      const response = await fetch('/api/connect-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          walletAddress: publicKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save wallet connection');
      }

      console.log('✅ Wallet connected successfully!');
      setWalletAddress(publicKey);
      
      // Show claim message if NFTs were claimed
      if (data.claimedNFTs > 0) {
        setClaimMessage(
          `Success! ${data.claimedNFTs} NFT${data.claimedNFTs > 1 ? 's' : ''} claimed for your existing badges! 🎉`
        );
      } else if (data.claimedNFTs === 0 && data.failedClaims === 0) {
        setClaimMessage('Wallet connected! Complete challenges to earn NFT badges.');
      } else {
        setClaimMessage('Wallet connected! Future badges will be minted as NFTs.');
      }

      // Call callback
      if (onConnected) {
        onConnected(publicKey, data.claimedNFTs || 0);
      }
    } catch (error: any) {
      console.error('❌ Connection error:', error);
      
      // Show user-friendly error
      const errorMessage = error.message || 'Failed to connect wallet';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      const provider = (window as any).solana;
      if (provider && provider.isConnected) {
        await provider.disconnect();
      }
      // Note: We keep the wallet address in the database
      // User can reconnect the same wallet later
      setWalletAddress(null);
      setClaimMessage(null);
      setError(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      // Even if disconnect fails, clear local state
      setWalletAddress(null);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: '24px',
          backgroundColor: 'rgba(253, 224, 71, 0.1)',
          border: '4px solid #fde047',
          boxShadow: '8px 8px 0 rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="flex items-center justify-center gap-2 text-white">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading wallet status...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: 'rgba(253, 224, 71, 0.1)',
        border: '4px solid #fde047',
        boxShadow: '8px 8px 0 rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Wallet className="w-6 h-6 text-yellow-400" />
        <h3
          className="text-lg font-bold text-yellow-400"
          style={{
            textShadow: '2px 2px 0 rgba(0, 0, 0, 0.5)',
          }}
        >
          Phantom Wallet
        </h3>
      </div>

      {/* Connected State */}
      {walletAddress ? (
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-green-900/30 border-2 border-green-500 rounded">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-green-400 mb-1">Wallet Connected</p>
              <p className="text-xs text-slate-300 font-mono break-all">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            🎁 Your badges will be minted as NFTs and sent to your wallet!
          </p>

          <button
            onClick={disconnectWallet}
            className="w-full px-4 py-2 text-sm font-bold text-red-400 bg-red-900/30 border-2 border-red-500 hover:bg-red-900/50 transition-colors"
            style={{
              boxShadow: '4px 4px 0 rgba(0, 0, 0, 0.3)',
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        /* Not Connected State */
        <div className="space-y-3">
          <p className="text-sm text-slate-300">
            Connect your Phantom wallet to receive your badges as Solana NFTs!
          </p>
          
          {/* Instructions */}
          <div className="text-xs text-slate-400 space-y-1 p-2 bg-slate-900/30 rounded border border-slate-700">
            <p className="font-bold text-yellow-400">📝 Steps:</p>
            <p>1. Click the button below</p>
            <p>2. Phantom popup will appear</p>
            <p>3. Click "Connect" or "Approve"</p>
            <p>4. Wait for confirmation</p>
          </div>

          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full px-4 py-3 font-bold text-black bg-yellow-400 border-4 border-black hover:bg-yellow-300 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            style={{
              boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.5)',
              imageRendering: 'pixelated',
            }}
          >
            {isConnecting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiting for approval...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect Phantom Wallet
              </span>
            )}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Don't have Phantom?{' '}
            <a
              href="https://phantom.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 underline"
            >
              Download here
            </a>
          </p>
        </div>
      )}

      {/* Success Message */}
      {claimMessage && (
        <div className="mt-4 p-3 bg-green-900/30 border-2 border-green-500 rounded">
          <p className="text-sm text-green-400 font-bold">{claimMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-red-900/30 border-2 border-red-500 rounded">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
