import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import User from "@/models/User";
import { claimAllBadgeNFTs } from "@/services/nftRewardService";
import { isSolanaConfigured } from "@/lib/solana";

/**
 * Connect user's Phantom wallet
 * POST /api/connect-wallet
 * Body: { userId: string, walletAddress: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, walletAddress } = body;

    // Check if Solana is configured
    if (!isSolanaConfigured()) {
      console.warn("⚠️ Solana not configured - wallet connected but NFTs will not be minted");
    }

    // Validation
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }

    // Validate Solana wallet address
    try {
      new PublicKey(walletAddress);
    } catch {
      return NextResponse.json(
        { error: "Invalid Solana wallet address" },
        { status: 400 }
      );
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if wallet is already connected to another user
    const existingUser = await User.findOne({
      phantomWalletAddress: walletAddress,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "This wallet is already connected to another account" },
        { status: 409 }
      );
    }

    // Update user's Phantom wallet address
    const isNewConnection = !user.phantomWalletAddress;
    user.phantomWalletAddress = walletAddress;
    await user.save();

    // If this is a new connection, claim all existing badges as NFTs
    let claimResult = { claimed: 0, failed: 0, nftAddresses: [] };
    if (isNewConnection) {
      claimResult = await claimAllBadgeNFTs(userId);
    }

    return NextResponse.json({
      success: true,
      walletAddress: user.phantomWalletAddress,
      isNewConnection,
      claimedNFTs: claimResult.claimed,
      failedClaims: claimResult.failed,
      nftAddresses: claimResult.nftAddresses,
    });
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return NextResponse.json(
      {
        error: "Failed to connect wallet",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Get user's connected wallet
 * GET /api/connect-wallet?userId=...
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      walletAddress: user.phantomWalletAddress || null,
      isConnected: !!user.phantomWalletAddress,
    });
  } catch (error) {
    console.error("Error getting wallet:", error);
    return NextResponse.json(
      {
        error: "Failed to get wallet",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
