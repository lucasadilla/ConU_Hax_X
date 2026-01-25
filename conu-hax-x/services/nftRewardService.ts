import { mintNFT } from "@/lib/solana";
import { NFTType } from "@/types";
import User, { IUser } from "@/models/User";
import Ticket, { ITicket } from "@/models/Ticket";
import Attempt, { IAttempt } from "@/models/Attempt";
import mongoose from "mongoose";

/**
 * Award badge for completing a ticket (off-chain)
 * This always happens when user passes, regardless of wallet connection
 */
export async function awardBadge(
  userId: string,
  ticketId: string
): Promise<boolean> {
  try {
    // Find the most recent passed attempt
    const attempt = await Attempt.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      ticketId: new mongoose.Types.ObjectId(ticketId),
      passed: true,
    }).sort({ createdAt: -1 });

    if (!attempt) {
      console.error(`No passed attempt found for user ${userId} on ticket ${ticketId}`);
      return false;
    }

    // If badge already awarded, return true
    if (attempt.badgeEarned) {
      return true;
    }

    // Award the badge
    attempt.badgeEarned = true;
    await attempt.save();

    console.log(`Badge awarded to user ${userId} for ticket ${ticketId}`);
    return true;
  } catch (error) {
    console.error(`Failed to award badge for user ${userId} on ticket ${ticketId}:`, error);
    return false;
  }
}

/**
 * Mint completion NFT to user's Phantom wallet
 * Only works if user has connected their Phantom wallet
 * Prevents duplicate minting - if user already has NFT for this ticket, skips
 */
export async function mintCompletionNFT(
  userId: string,
  ticketId: string
): Promise<string | null> {
  try {
    // Check if user already has NFT for this ticket
    const existingAttempt = await Attempt.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      ticketId: new mongoose.Types.ObjectId(ticketId),
      nftAddress: { $exists: true, $ne: null },
    });

    if (existingAttempt?.nftAddress) {
      console.log(
        `User ${userId} already has NFT ${existingAttempt.nftAddress} for ticket ${ticketId}`
      );
      return existingAttempt.nftAddress;
    }

    // Get user and ticket data
    const user = await User.findById(userId);
    const ticket = await Ticket.findById(ticketId);

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    if (!ticket) {
      throw new Error(`Ticket ${ticketId} not found`);
    }

    if (!user.phantomWalletAddress) {
      console.log(
        `User ${userId} has not connected Phantom wallet. NFT will not be minted.`
      );
      return null;
    }

    // Check if user has earned the badge for this ticket
    const attempt = await Attempt.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      ticketId: new mongoose.Types.ObjectId(ticketId),
      badgeEarned: true,
    });

    if (!attempt) {
      console.log(
        `User ${userId} has not earned badge for ticket ${ticketId}. Cannot mint NFT.`
      );
      return null;
    }

    if (!ticket.completionNFTName || !ticket.completionNFTDescription || !ticket.completionNFTImageUrl) {
      throw new Error(`Ticket ${ticketId} is missing NFT metadata`);
    }

    // Mint the NFT to user's Phantom wallet
    const nftAddress = await mintNFT({
      userWallet: user.phantomWalletAddress,
      type: NFTType.BADGE,
      name: ticket.completionNFTName,
      description: ticket.completionNFTDescription,
      imageUrl: ticket.completionNFTImageUrl,
      attributes: ticket.completionNFTAttributes || [],
    });

    // Update the attempt with NFT address
    attempt.nftAddress = nftAddress;
    attempt.nftMintedAt = new Date();
    await attempt.save();

    console.log(
      `Successfully minted NFT ${nftAddress} to Phantom wallet ${user.phantomWalletAddress} for user ${userId} on ticket ${ticketId}`
    );
    return nftAddress;
  } catch (error) {
    console.error(
      `Failed to mint completion NFT for user ${userId} on ticket ${ticketId}:`,
      error
    );
    // Return null on error (don't throw, just log as requested)
    return null;
  }
}

/**
 * Claim NFTs for all badges user has earned but not yet minted
 * Called after user connects their Phantom wallet
 */
export async function claimAllBadgeNFTs(userId: string): Promise<{
  claimed: number;
  failed: number;
  nftAddresses: string[];
}> {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    if (!user.phantomWalletAddress) {
      return { claimed: 0, failed: 0, nftAddresses: [] };
    }

    // Find all attempts where badge is earned but NFT not minted
    const unclaimedBadges = await Attempt.find({
      userId: new mongoose.Types.ObjectId(userId),
      badgeEarned: true,
      $or: [
        { nftAddress: { $exists: false } },
        { nftAddress: null },
      ],
    }).populate("ticketId");

    const results = {
      claimed: 0,
      failed: 0,
      nftAddresses: [] as string[],
    };

    for (const attempt of unclaimedBadges) {
      const ticket = attempt.ticketId as ITicket;
      if (!ticket) continue;

      const nftAddress = await mintCompletionNFT(userId, ticket._id.toString());
      if (nftAddress) {
        results.claimed++;
        results.nftAddresses.push(nftAddress);
      } else {
        results.failed++;
      }
    }

    console.log(
      `Claimed ${results.claimed} NFTs for user ${userId}, ${results.failed} failed`
    );
    return results;
  } catch (error) {
    console.error(`Failed to claim badge NFTs for user ${userId}:`, error);
    return { claimed: 0, failed: 0, nftAddresses: [] };
  }
}
