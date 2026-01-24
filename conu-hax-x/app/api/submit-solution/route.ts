import { NextRequest, NextResponse } from "next/server";
import { mintNFT } from "@/lib/solana";
import { NFTType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userWallet, nftType, name, description, imageUrl, attributes, externalUrl } = body;

    // Validation
    if (!userWallet) {
      return NextResponse.json(
        { error: "userWallet is required" },
        { status: 400 }
      );
    }

    if (!name || !description || !imageUrl) {
      return NextResponse.json(
        { error: "name, description, and imageUrl are required" },
        { status: 400 }
      );
    }

    // Validate NFT type or default to BADGE
    const type = nftType && Object.values(NFTType).includes(nftType) 
      ? nftType 
      : NFTType.BADGE;

    // Mint the NFT
    const nftAddress = await mintNFT({
      userWallet,
      type,
      name,
      description,
      imageUrl,
      attributes: attributes || [],
      externalUrl,
    });

    return NextResponse.json({
      success: true,
      nftAddress,
      type,
    });
  } catch (error) {
    console.error("Error minting NFT:", error);
    return NextResponse.json(
      {
        error: "Failed to mint NFT",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
