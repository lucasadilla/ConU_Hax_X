import { mintCompletionNFT } from "./nftRewardService";
import Attempt, { IAttempt } from "@/models/Attempt";
import mongoose from "mongoose";

/**
 * Evaluate a solution and mint NFT if passed
 * This is a template - adapt to your actual evaluation logic
 */
export async function evaluateSolution(
  userId: string,
  ticketId: string,
  solution: string
): Promise<{ passed: boolean; score?: number; nftAddress?: string | null }> {
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
  });

  await attempt.save();

  // If passed, mint NFT immediately
  let nftAddress: string | null = null;
  if (passed) {
    nftAddress = await mintCompletionNFT(userId, ticketId);
  }

  return {
    passed,
    score,
    nftAddress,
  };
}
