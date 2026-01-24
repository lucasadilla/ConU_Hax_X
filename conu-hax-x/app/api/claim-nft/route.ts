import { NextRequest, NextResponse } from "next/server";
import { mintCompletionNFT, claimAllBadgeNFTs } from "@/services/nftRewardService";

/**
 * Claim NFT for a specific badge
 * POST /api/claim-nft
 * Body: { userId: string, ticketId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ticketId } = body;

    // Validation
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!ticketId) {
      return NextResponse.json(
        { error: "ticketId is required" },
        { status: 400 }
      );
    }

    // Mint NFT for the specific badge
    const nftAddress = await mintCompletionNFT(userId, ticketId);

    if (!nftAddress) {
      return NextResponse.json(
        {
          error: "Failed to claim NFT",
          message: "User may not have connected wallet or badge not earned",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      nftAddress,
    });
  } catch (error) {
    console.error("Error claiming NFT:", error);
    return NextResponse.json(
      {
        error: "Failed to claim NFT",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Claim all NFTs for badges user has earned
 * POST /api/claim-nft/all
 * Body: { userId: string }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const result = await claimAllBadgeNFTs(userId);

    return NextResponse.json({
      success: true,
      claimed: result.claimed,
      failed: result.failed,
      nftAddresses: result.nftAddresses,
    });
  } catch (error) {
    console.error("Error claiming all NFTs:", error);
    return NextResponse.json(
      {
        error: "Failed to claim NFTs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
