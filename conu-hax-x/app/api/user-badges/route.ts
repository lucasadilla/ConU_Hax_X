import { NextRequest, NextResponse } from "next/server";
import Attempt from "@/models/Attempt";
import { connectToDatabase } from "@/lib/mongodb";

/**
 * Get badge NFT status for a user
 * GET /api/user-badges?userId=...
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

    await connectToDatabase();

    // Get all attempts where user earned a badge
    const attempts = await Attempt.find({
      userId,
      badgeEarned: true,
    })
      .populate("ticketId")
      .sort({ createdAt: -1 });

    // Deduplicate: Only one badge record per ticket
    const uniqueBadgesMap = new Map();

    attempts.forEach((attempt) => {
      const tid = attempt.ticketId?._id?.toString() || attempt.ticketId?.toString();
      if (!tid) return;

      if (!uniqueBadgesMap.has(tid)) {
        uniqueBadgesMap.set(tid, {
          ticketId: tid,
          ticketName: attempt.ticketId.title || "Challenge",
          badgeEarned: attempt.badgeEarned,
          nftMinted: !!attempt.nftAddress,
          nftAddress: attempt.nftAddress || null,
          nftMintedAt: attempt.nftMintedAt || null,
          completedAt: attempt.createdAt,
        });
      }
    });

    const badges = Array.from(uniqueBadgesMap.values());

    return NextResponse.json({
      success: true,
      badges,
      totalBadges: badges.length,
      totalNFTs: badges.filter((b) => b.nftMinted).length,
    });
  } catch (error) {
    console.error("Error fetching badge NFT status:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch badge status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
