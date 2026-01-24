import { awardBadge, mintCompletionNFT } from "./nftRewardService";
import Attempt, { IAttempt } from "@/models/Attempt";
import mongoose from "mongoose";

/**
 * Evaluate a solution and award badge if passed
 * Badge is always awarded (off-chain)
 * NFT is only minted if user has connected Phantom wallet
 */
export async function evaluateSolution(
  userId: string,
  ticketId: string,
  solution: string
): Promise<{ passed: boolean; score?: number; badgeEarned: boolean; nftAddress?: string | null }> {
  // TODO: Implement your actual evaluation logic here
  // This is just a placeholder example
  
  // Example: Run tests, check code quality, etc.
  const passed = true; // Replace with actual evaluation
  const score = 85; // Replace with actual score calculation

  // Create attempt record
  const attempt = new Attempt({
    userId: new mongoose.Types.ObjectId(userId),
    ticketId: new mongoose.Types.ObjectId(ticketId),
    solution,
    score,
    passed,
    badgeEarned: false, // Will be set by awardBadge
  });

  await attempt.save();

  let badgeEarned = false;
  let nftAddress: string | null = null;

  if (passed) {
    // Always award badge (off-chain)
    badgeEarned = await awardBadge(userId, ticketId);
    
    // Only mint NFT if user has connected Phantom wallet
    if (badgeEarned) {
      nftAddress = await mintCompletionNFT(userId, ticketId);
    }
  }

  return {
    passed,
    score,
    badgeEarned,
    nftAddress,
  };
}
