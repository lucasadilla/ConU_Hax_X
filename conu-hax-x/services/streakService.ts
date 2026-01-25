// Service for managing user daily streaks and activity tracking
import { connectToDatabase } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import Badge from '@/models/Badge';
import mongoose from 'mongoose';

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastSubmissionDate: Date | null;
  streakStartDate: Date | null;
  totalDaysActive: number;
  streakStatus: 'active' | 'broken' | 'new';
  daysUntilBreak: number;
}

export interface StreakMilestone {
  days: number;
  badgeName: string;
  badgeDescription: string;
  points: number;
  color: string;
}

// Streak milestones for badge rewards
const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    badgeName: '🔥 3-Day Fire Starter',
    badgeDescription: 'Submitted solutions for 3 consecutive days',
    points: 50,
    color: '#ff6b6b',
  },
  {
    days: 7,
    badgeName: '⚡ Week Warrior',
    badgeDescription: 'Maintained a 7-day coding streak',
    points: 100,
    color: '#ffa500',
  },
  {
    days: 14,
    badgeName: '💪 Two-Week Titan',
    badgeDescription: 'Achieved a 14-day submission streak',
    points: 200,
    color: '#4ade80',
  },
  {
    days: 30,
    badgeName: '🏆 Monthly Master',
    badgeDescription: 'Completed an incredible 30-day streak',
    points: 500,
    color: '#3b82f6',
  },
  {
    days: 60,
    badgeName: '💎 Diamond Dedication',
    badgeDescription: 'Unstoppable! 60-day coding streak',
    points: 1000,
    color: '#8b5cf6',
  },
  {
    days: 100,
    badgeName: '👑 Century Champion',
    badgeDescription: 'Legendary! 100-day streak achieved',
    points: 2000,
    color: '#ffd700',
  },
];

export class StreakService {
  /**
   * Check if a date is today (same calendar day, ignoring time)
   */
  private static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  /**
   * Check if two dates are consecutive days
   */
  private static isConsecutiveDay(yesterday: Date, today: Date): boolean {
    const dayInMs = 24 * 60 * 60 * 1000;
    const diff = today.getTime() - yesterday.getTime();
    return diff >= dayInMs && diff < 2 * dayInMs;
  }

  /**
   * Get days between two dates
   */
  private static getDaysDifference(date1: Date, date2: Date): number {
    const dayInMs = 24 * 60 * 60 * 1000;
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diff / dayInMs);
  }

  /**
   * Update user streak on submission
   */
  static async updateStreak(userId: string | mongoose.Types.ObjectId): Promise<{
    currentStreak: number;
    streakIncreased: boolean;
    streakBroken: boolean;
    milestoneReached?: StreakMilestone;
    badge?: any;
  }> {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    const lastSubmission = user.lastSubmissionDate;

    let streakIncreased = false;
    let streakBroken = false;
    let milestoneReached: StreakMilestone | undefined;
    let badge: any = undefined;

    // First submission ever
    if (!lastSubmission) {
      user.currentStreak = 1;
      user.streakStartDate = now;
      user.totalDaysActive = 1;
      streakIncreased = true;
    }
    // Already submitted today - don't count again
    else if (this.isSameDay(lastSubmission, now)) {
      // No change to streak
    }
    // Consecutive day - increase streak
    else if (this.isConsecutiveDay(lastSubmission, now)) {
      user.currentStreak += 1;
      user.totalDaysActive += 1;
      streakIncreased = true;

      // Update longest streak
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }

      // Check for milestone
      const milestone = STREAK_MILESTONES.find(m => m.days === user.currentStreak);
      if (milestone) {
        milestoneReached = milestone;
        
        // Award streak badge
        badge = await Badge.create({
          userId: user._id,
          name: milestone.badgeName,
          description: milestone.badgeDescription,
          type: 'gold',
          category: 'streak',
          achievedFor: `Maintained ${milestone.days}-day streak`,
          color: milestone.color,
          rarity: milestone.days >= 100 ? 'legendary' : milestone.days >= 30 ? 'epic' : 'rare',
          pointsAwarded: milestone.points,
        });

        user.badges.push(badge._id);
        user.totalPoints += milestone.points;
      }
    }
    // Streak broken (more than 1 day gap)
    else {
      user.currentStreak = 1; // Start new streak
      user.streakStartDate = now;
      user.totalDaysActive += 1;
      streakBroken = true;
    }

    user.lastSubmissionDate = now;
    user.lastActiveAt = now;
    await user.save();

    return {
      currentStreak: user.currentStreak,
      streakIncreased,
      streakBroken,
      milestoneReached,
      badge,
    };
  }

  /**
   * Get user's streak information
   */
  static async getStreakInfo(userId: string | mongoose.Types.ObjectId): Promise<StreakInfo> {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const now = new Date();
    let streakStatus: 'active' | 'broken' | 'new' = 'new';
    let daysUntilBreak = 1;

    if (user.lastSubmissionDate) {
      const lastSubmission = new Date(user.lastSubmissionDate);
      const daysSinceSubmission = this.getDaysDifference(lastSubmission, now);

      if (daysSinceSubmission === 0) {
        // Submitted today
        streakStatus = 'active';
        daysUntilBreak = 1;
      } else if (daysSinceSubmission === 1) {
        // Submitted yesterday - streak at risk
        streakStatus = 'active';
        daysUntilBreak = 0; // Submit today or lose streak!
      } else {
        // Streak broken
        streakStatus = 'broken';
        daysUntilBreak = 0;
      }
    }

    return {
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastSubmissionDate: user.lastSubmissionDate || null,
      streakStartDate: user.streakStartDate || null,
      totalDaysActive: user.totalDaysActive,
      streakStatus,
      daysUntilBreak,
    };
  }

  /**
   * Get next streak milestone for user
   */
  static async getNextMilestone(userId: string | mongoose.Types.ObjectId): Promise<StreakMilestone | null> {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Find next milestone user hasn't reached
    return STREAK_MILESTONES.find(m => m.days > user.currentStreak) || null;
  }

  /**
   * Get all streak milestones
   */
  static getStreakMilestones(): StreakMilestone[] {
    return STREAK_MILESTONES;
  }

  /**
   * Get leaderboard by streak
   */
  static async getStreakLeaderboard(limit: number = 10): Promise<IUser[]> {
    await connectToDatabase();

    return User.find()
      .sort({ currentStreak: -1, longestStreak: -1 })
      .limit(limit)
      .select('username displayName avatarUrl currentStreak longestStreak totalDaysActive');
  }

  /**
   * Check if user needs streak warning (submitted yesterday but not today)
   */
  static async needsStreakWarning(userId: string | mongoose.Types.ObjectId): Promise<boolean> {
    const info = await this.getStreakInfo(userId);
    return info.streakStatus === 'active' && info.daysUntilBreak === 0;
  }

  /**
   * Manually break streak (admin function or for testing)
   */
  static async breakStreak(userId: string | mongoose.Types.ObjectId): Promise<void> {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.currentStreak = 0;
    user.streakStartDate = null;
    await user.save();
  }
}

export default StreakService;
