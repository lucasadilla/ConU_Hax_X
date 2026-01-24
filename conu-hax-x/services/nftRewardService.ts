import { mintNFT } from "@/lib/solana";
import { NFTType } from "@/types";
import User, { IUser } from "@/models/User";
import Ticket, { ITicket } from "@/models/Ticket";
import Attempt, { IAttempt } from "@/models/Attempt";
import mongoose from "mongoose";

/**
 * Mint completion NFT for a user who passed a ticket
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

    if (!user.solanaWalletAddress) {
      console.error(
        `User ${userId} does not have a Solana wallet. Wallet should be generated on signup.`
      );
      return null;
    }

    if (!ticket.completionNFTName || !ticket.completionNFTDescription || !ticket.completionNFTImageUrl) {
      throw new Error(`Ticket ${ticketId} is missing NFT metadata`);
    }

    // Mint the NFT
    const nftAddress = await mintNFT({
      userWallet: user.solanaWalletAddress,
      type: NFTType.BADGE,
      name: ticket.completionNFTName,
      description: ticket.completionNFTDescription,
      imageUrl: ticket.completionNFTImageUrl,
      attributes: ticket.completionNFTAttributes || [],
    });

    // Find the most recent passed attempt for this user and ticket
    const attempt = await Attempt.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      ticketId: new mongoose.Types.ObjectId(ticketId),
      passed: true,
    }).sort({ createdAt: -1 });

    if (attempt) {
      // Update the attempt with NFT address
      attempt.nftAddress = nftAddress;
      attempt.nftMintedAt = new Date();
      await attempt.save();
    } else {
      // If no attempt found, create a record (shouldn't happen, but safety check)
      console.warn(
        `No passed attempt found for user ${userId} and ticket ${ticketId}, but NFT was minted`
      );
    }

    console.log(
      `Successfully minted NFT ${nftAddress} for user ${userId} on ticket ${ticketId}`
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
