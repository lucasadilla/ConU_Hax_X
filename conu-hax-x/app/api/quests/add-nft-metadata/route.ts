import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

/**
 * API route to add NFT metadata to existing quests
 * POST /api/quests/add-nft-metadata
 */
export async function POST() {
  try {
    await connectToDatabase();

    // Get all tickets
    const tickets = await Ticket.find({});
    
    const updates = [];
    
    for (const ticket of tickets) {
      // Generate NFT metadata based on ticket properties
      const nftName = `${ticket.title} Badge`;
      const nftDescription = `Completion badge for: ${ticket.title}. ${ticket.description.substring(0, 100)}...`;
      
      // Use the badge image if available, or a default
      const badgeImages: { [key: string]: string } = {
        'Bug Slayer': '/badges/bug-slayer-quest-1-easy.svg',
        'Feature Forge': '/badges/feature-forge-quest-1-easy.svg',
        'Debug Detective': '/badges/debug-detective-quest-1-easy.svg',
      };
      
      // Determine image based on theme and difficulty
      const theme = ticket.theme || 'Bug Slayer';
      const difficulty = ticket.difficulty || 'easy';
      const questNumber = ticket.questNumber || 1;
      
      const imageUrl = `/badges/${theme.toLowerCase().replace(' ', '-')}-quest-${questNumber}-${difficulty}.svg`;
      
      // Create attributes
      const attributes = [
        { trait_type: 'Theme', value: theme },
        { trait_type: 'Difficulty', value: difficulty },
        { trait_type: 'Quest Number', value: questNumber.toString() },
        { trait_type: 'Points', value: ticket.points.toString() },
        { trait_type: 'Category', value: ticket.category || 'Programming' },
      ];
      
      // Update ticket
      ticket.completionNFTName = nftName;
      ticket.completionNFTDescription = nftDescription;
      ticket.completionNFTImageUrl = imageUrl;
      ticket.completionNFTAttributes = attributes;
      
      await ticket.save();
      
      updates.push({
        ticketId: ticket._id,
        title: ticket.title,
        nftName,
        imageUrl,
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Updated ${updates.length} tickets with NFT metadata`,
      updates,
    });
  } catch (error) {
    console.error('Error adding NFT metadata:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
