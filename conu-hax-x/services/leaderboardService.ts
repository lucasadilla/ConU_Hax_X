// Service for managing leaderboards and rankings
import { connectToDatabase } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  totalPoints: number;
  experience: number;
  level: number;
  ticketsCompleted: number;
  currentStreak: number;
  badges: number;
}

export interface LeaderboardFilters {
  limit?: number;
  timeframe?: 'all' | 'week' | 'month';
  category?: 'xp' | 'points' | 'streak' | 'completed';
}

export class LeaderboardService {
  /**
   * Get leaderboard by experience points
   */
  static async getXPLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    await connectToDatabase();

    const users = await User.find()
      .sort({ experience: -1, totalPoints: -1, username: 1 })
      .limit(limit)
      .select('username displayName avatarUrl totalPoints experience level ticketsCompleted currentStreak badges');

    return users.map((user, index) => ({
      rank: index + 1,
      userId: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      totalPoints: user.totalPoints,
      experience: user.experience,
      level: user.level,
      ticketsCompleted: user.ticketsCompleted,
      currentStreak: user.currentStreak,
      badges: user.badges.length,
    }));
  }

  /**
   * Get leaderboard by total points
   */
  static async getPointsLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    await connectToDatabase();

    const users = await User.find()
      .sort({ totalPoints: -1, experience: -1, username: 1 })
      .limit(limit)
      .select('username displayName avatarUrl totalPoints experience level ticketsCompleted currentStreak badges');

    return users.map((user, index) => ({
      rank: index + 1,
      userId: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      totalPoints: user.totalPoints,
      experience: user.experience,
      level: user.level,
      ticketsCompleted: user.ticketsCompleted,
      currentStreak: user.currentStreak,
      badges: user.badges.length,
    }));
  }

  /**
   * Get leaderboard by streak
   */
  static async getStreakLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    await connectToDatabase();

    const users = await User.find()
      .sort({ currentStreak: -1, longestStreak: -1, username: 1 })
      .limit(limit)
      .select('username displayName avatarUrl totalPoints experience level ticketsCompleted currentStreak badges');

    return users.map((user, index) => ({
      rank: index + 1,
      userId: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      totalPoints: user.totalPoints,
      experience: user.experience,
      level: user.level,
      ticketsCompleted: user.ticketsCompleted,
      currentStreak: user.currentStreak,
      badges: user.badges.length,
    }));
  }

  /**
   * Get leaderboard by tickets completed
   */
  static async getCompletedLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    await connectToDatabase();

    const users = await User.find()
      .sort({ ticketsCompleted: -1, totalPoints: -1, username: 1 })
      .limit(limit)
      .select('username displayName avatarUrl totalPoints experience level ticketsCompleted currentStreak badges');

    return users.map((user, index) => ({
      rank: index + 1,
      userId: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      totalPoints: user.totalPoints,
      experience: user.experience,
      level: user.level,
      ticketsCompleted: user.ticketsCompleted,
      currentStreak: user.currentStreak,
      badges: user.badges.length,
    }));
  }

  /**
   * Get user's rank by experience
   */
  static async getUserRank(userId: string): Promise<{
    xpRank: number;
    pointsRank: number;
    streakRank: number;
    completedRank: number;
    totalUsers: number;
  }> {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const [xpRank, pointsRank, streakRank, completedRank, totalUsers] = await Promise.all([
      // XP Rank
      User.countDocuments({
        $or: [
          { experience: { $gt: user.experience } },
          {
            experience: user.experience,
            totalPoints: { $gt: user.totalPoints },
          },
        ],
      }).then(count => count + 1),

      // Points Rank
      User.countDocuments({
        $or: [
          { totalPoints: { $gt: user.totalPoints } },
          {
            totalPoints: user.totalPoints,
            experience: { $gt: user.experience },
          },
        ],
      }).then(count => count + 1),

      // Streak Rank
      User.countDocuments({
        currentStreak: { $gt: user.currentStreak },
      }).then(count => count + 1),

      // Completed Rank
      User.countDocuments({
        $or: [
          { ticketsCompleted: { $gt: user.ticketsCompleted } },
          {
            ticketsCompleted: user.ticketsCompleted,
            totalPoints: { $gt: user.totalPoints },
          },
        ],
      }).then(count => count + 1),

      // Total users
      User.countDocuments(),
    ]);

    return {
      xpRank,
      pointsRank,
      streakRank,
      completedRank,
      totalUsers,
    };
  }

  /**
   * Get leaderboard stats
   */
  static async getLeaderboardStats(): Promise<{
    totalUsers: number;
    totalXP: number;
    totalTicketsCompleted: number;
    averageLevel: number;
    topStreak: number;
  }> {
    await connectToDatabase();

    const [totalUsers, stats, topStreakUser] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: null,
            totalXP: { $sum: '$experience' },
            totalTicketsCompleted: { $sum: '$ticketsCompleted' },
            averageLevel: { $avg: '$level' },
          },
        },
      ]),
      User.findOne().sort({ currentStreak: -1 }).select('currentStreak'),
    ]);

    return {
      totalUsers,
      totalXP: stats[0]?.totalXP || 0,
      totalTicketsCompleted: stats[0]?.totalTicketsCompleted || 0,
      averageLevel: Math.round(stats[0]?.averageLevel || 1),
      topStreak: topStreakUser?.currentStreak || 0,
    };
  }
}

export default LeaderboardService;
