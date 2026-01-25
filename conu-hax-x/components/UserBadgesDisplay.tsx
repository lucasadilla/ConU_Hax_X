'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Flame, Link as LinkIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface BadgeNFTStatus {
  ticketId: string;
  ticketName: string;
  badgeEarned: boolean;
  nftMinted: boolean;
  nftAddress: string | null;
  nftMintedAt: string | null;
  completedAt: string;
}

interface UserBadgesDisplayProps {
  userId: string;
}

export function UserBadgesDisplay({ userId }: UserBadgesDisplayProps) {
  const [badges, setBadges] = useState<BadgeNFTStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBadges();
  }, [userId]);

  const fetchBadges = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user-badges?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch badges');
      }

      setBadges(data.badges);
    } catch (err) {
      console.error('Error fetching badges:', err);
      setError(err instanceof Error ? err.message : 'Failed to load badges');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <p className="text-slate-400 text-sm text-center py-8">
        No badges earned yet. Complete challenges to earn your first badge!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.ticketId}
          className="group relative p-4 rounded-lg text-center hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer"
          style={{
            backgroundColor: 'rgba(253, 224, 71, 0.1)',
            border: '2px solid #fde047',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
          }}
        >
          {/* NFT Indicator Badge */}
          {badge.nftMinted && (
            <div
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: '#22c55e',
                border: '2px solid #15803d',
                boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
              }}
              title="Minted as NFT"
            >
              <LinkIcon className="w-3 h-3 text-white" />
            </div>
          )}

          {/* Badge Icon */}
          <div className="text-3xl mb-2">
            🏆
          </div>

          {/* Badge Name */}
          <div className="text-sm font-bold text-white mb-1">
            {badge.ticketName}
          </div>

          {/* Status Text */}
          <div className="text-xs text-slate-400">
            {badge.nftMinted ? (
              <span className="text-green-400">✓ NFT Minted</span>
            ) : (
              <span className="text-yellow-400">Badge Earned</span>
            )}
          </div>

          {/* Tooltip on hover with NFT address */}
          {badge.nftMinted && badge.nftAddress && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div
                className="px-3 py-2 text-xs text-white rounded whitespace-nowrap"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '2px solid #fde047',
                  boxShadow: '3px 3px 0 rgba(0,0,0,0.5)',
                }}
              >
                <div className="font-bold mb-1">NFT Address:</div>
                <div className="font-mono text-yellow-400">
                  {badge.nftAddress.slice(0, 8)}...{badge.nftAddress.slice(-8)}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
