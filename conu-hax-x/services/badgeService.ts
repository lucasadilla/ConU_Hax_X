// Service for managing badges and achievements
import { connectToDatabase } from '@/lib/mongodb';
import Badge, { IBadge } from '@/models/Badge';
import User from '@/models/User';
import mongoose from 'mongoose';

export class BadgeService {
  /**
   * Award a completion badge
   */
  static async awardCompletionBadge(
    userId: string | mongoose.Types.ObjectId,
    ticketId: string | mongoose.Types.ObjectId,
    score: number,
    ticketTitle: string
  ): Promise<IBadge> {
    await connectToDatabase();

    // Check if user already has this badge
    const existing = await Badge.findOne({ userId, ticketId, category: 'completion' });
    if (existing) {
      return existing;
    }

    // Create badge
    const badge = await (Badge as any).createCompletionBadge(
      userId,
      ticketId,
      score,
      ticketTitle
    );

    // Update user
    const user = await User.findById(userId);
    if (user) {
      user.badges.push(badge._id);
      await user.save();
    }

    return badge;
  }

  /**
   * Check and award streak badge
   */
  static async checkAndAwardStreakBadge(
    userId: string | mongoose.Types.ObjectId
  ): Promise<IBadge | null> {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) return null;

    const streak = user.currentStreak;
    
    // Award badges at milestones: 7, 14, 30 days
    const milestones = [7, 14, 30];
    const milestone = milestones.find(m => streak === m);
    
    if (!milestone) return null;

    // Check if already awarded
    const existing = await Badge.findOne({
      userId,
      category: 'streak',
      name: `${milestone}-Day Streak`,
    });

    if (existing) return null;

    // Create streak badge
    const badge = await (Badge as any).createStreakBadge(userId, milestone);

    // Update user
    user.badges.push(badge._id);
    user.addPoints(badge.pointsAwarded);
    await user.save();

    return badge;
  }

  /**
   * Get user badges
   */
  static async getUserBadges(
    userId: string | mongoose.Types.ObjectId
  ): Promise<IBadge[]> {
    await connectToDatabase();

    return Badge.find({ userId })
      .sort({ awardedAt: -1 })
      .populate('ticketId');
  }

  /**
   * Get badge by ID
   */
  static async getBadgeById(
    badgeId: string | mongoose.Types.ObjectId
  ): Promise<IBadge | null> {
    await connectToDatabase();

    return Badge.findById(badgeId)
      .populate('userId')
      .populate('ticketId');
  }

  /**
   * Get user badge count by type
   */
  static async getUserBadgeStats(
    userId: string | mongoose.Types.ObjectId
  ): Promise<{
    total: number;
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    special: number;
  }> {
    await connectToDatabase();

    const badges = await Badge.find({ userId });

    return {
      total: badges.length,
      bronze: badges.filter(b => b.type === 'bronze').length,
      silver: badges.filter(b => b.type === 'silver').length,
      gold: badges.filter(b => b.type === 'gold').length,
      platinum: badges.filter(b => b.type === 'platinum').length,
      special: badges.filter(b => b.type === 'special').length,
    };
  }

  /**
   * Mark badge as minted on Solana
   */
  static async markBadgeAsMinted(
    badgeId: string | mongoose.Types.ObjectId,
    mintAddress: string,
    transactionSignature: string
  ): Promise<IBadge | null> {
    await connectToDatabase();

    return Badge.findByIdAndUpdate(
      badgeId,
      {
        isMinted: true,
        mintAddress,
        transactionSignature,
      },
      { new: true }
    );
  }

  /**
   * Get unminted badges for a user
   */
  static async getUnmintedBadges(
    userId: string | mongoose.Types.ObjectId
  ): Promise<IBadge[]> {
    await connectToDatabase();

    return Badge.find({ userId, isMinted: false })
      .sort({ awardedAt: -1 });
  }
}

export default BadgeService;
