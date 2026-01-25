'use client';

import React from 'react';
import { CheckCircle, Link as LinkIcon, Wallet } from 'lucide-react';
import Link from 'next/link';

interface ChallengeCompletionNotificationProps {
  badgeEarned: boolean;
  nftMinted: boolean;
  walletConnected: boolean;
  onConnectWallet?: () => void;
}

export function ChallengeCompletionNotification({
  badgeEarned,
  nftMinted,
  walletConnected,
  onConnectWallet,
}: ChallengeCompletionNotificationProps) {
  if (!badgeEarned) return null;

  return (
    <div className="space-y-4">
      {/* Badge Earned Message */}
      <div
        className="p-4 rounded-lg flex items-start gap-3"
        style={{
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          border: '3px solid #22c55e',
          boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
        }}
      >
        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold text-green-400 mb-1">🎉 Badge Earned!</h3>
          <p className="text-sm text-slate-300">
            Congratulations! You've earned a badge for completing this challenge.
          </p>
        </div>
      </div>

      {/* NFT Status */}
      {nftMinted ? (
        // NFT was minted
        <div
          className="p-4 rounded-lg flex items-start gap-3"
          style={{
            backgroundColor: 'rgba(253, 224, 71, 0.1)',
            border: '3px solid #fde047',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
          }}
        >
          <LinkIcon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-yellow-400 mb-1">🎁 NFT Minted!</h3>
            <p className="text-sm text-slate-300 mb-2">
              Your badge has been minted as a Solana NFT and sent to your Phantom wallet!
            </p>
            <p className="text-xs text-slate-400">
              Check your Phantom wallet's "Collectibles" tab to see it.
            </p>
          </div>
        </div>
      ) : walletConnected ? (
        // Wallet connected but NFT not minted (error case)
        <div
          className="p-4 rounded-lg flex items-start gap-3"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '3px solid #ef4444',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex-1">
            <h3 className="font-bold text-red-400 mb-1">⚠️ NFT Minting Failed</h3>
            <p className="text-sm text-slate-300 mb-2">
              Your badge was earned but the NFT couldn't be minted. Don't worry - you can claim it later from your profile!
            </p>
            <Link
              href={`/profile/${''}`}
              className="text-xs text-yellow-400 hover:text-yellow-300 underline"
            >
              Go to Profile →
            </Link>
          </div>
        </div>
      ) : (
        // No wallet connected - prompt to connect
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: 'rgba(253, 224, 71, 0.1)',
            border: '3px solid #fde047',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <Wallet className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-400 mb-1">💎 Want this as an NFT?</h3>
              <p className="text-sm text-slate-300 mb-3">
                Connect your Phantom wallet to mint your badges as Solana NFTs! All your existing badges will be automatically claimed.
              </p>
            </div>
          </div>

          <Link
            href={`/profile/${''}`}
            className="block w-full px-4 py-2 text-center font-bold text-black bg-yellow-400 border-4 border-black hover:bg-yellow-300 transition-colors"
            style={{
              boxShadow: '4px 4px 0 rgba(0, 0, 0, 0.5)',
            }}
          >
            Connect Phantom Wallet
          </Link>

          <p className="text-xs text-slate-400 text-center mt-2">
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
    </div>
  );
}
