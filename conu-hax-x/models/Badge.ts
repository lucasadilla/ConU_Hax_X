// MongoDB Badge model - Achievement badges
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadge extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  // Badge Info
  name: string;
  description: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'special';
  category: 'completion' | 'streak' | 'score' | 'speed' | 'special';

  // Achievement
  achievedFor: string; // What this badge was earned for
  ticketId?: mongoose.Types.ObjectId; // If earned for a specific ticket

  // Metadata
  iconUrl?: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  // Blockchain (Solana NFT)
  isMinted: boolean;
  mintAddress?: string;
  transactionSignature?: string;

  // Points
  pointsAwarded: number;

  // Timestamps
  awardedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Badge Info
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      trim: true,
      maxlength: [100, 'Badge name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    type: {
      type: String,
      required: true,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'special'],
      default: 'bronze',
    },
    category: {
      type: String,
      required: true,
      enum: ['completion', 'streak', 'score', 'speed', 'special'],
      default: 'completion',
    },

    // Achievement
    achievedFor: {
      type: String,
      required: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },

    // Metadata
    iconUrl: {
      type: String,
    },
    color: {
      type: String,
      default: '#gray',
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common',
    },

    // Blockchain (Solana NFT)
    isMinted: {
      type: Boolean,
      default: false,
    },
    mintAddress: {
      type: String,
    },
    transactionSignature: {
      type: String,
    },

    // Points
    pointsAwarded: {
      type: Number,
      required: true,
      min: 0,
      default: 100,
    },

    awardedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
BadgeSchema.index({ userId: 1, awardedAt: -1 });
BadgeSchema.index({ type: 1 });
BadgeSchema.index({ category: 1 });
BadgeSchema.index({ rarity: 1 });
BadgeSchema.index({ isMinted: 1 });

// Statics for badge creation
BadgeSchema.statics.createCompletionBadge = async function (
  userId: mongoose.Types.ObjectId,
  ticketId: mongoose.Types.ObjectId,
  score: number,
  ticketTitle: string
) {
  const type = score >= 90 ? 'gold' : score >= 75 ? 'silver' : 'bronze';
  const rarity = score >= 95 ? 'legendary' : score >= 85 ? 'epic' : score >= 70 ? 'rare' : 'common';

  return this.create({
    userId,
    ticketId,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Completion`,
    description: `Completed "${ticketTitle}" with a score of ${score}`,
    type,
    category: 'completion',
    achievedFor: `Completed ${ticketTitle}`,
    rarity,
    pointsAwarded: score,
    color: type === 'gold' ? '#FFD700' : type === 'silver' ? '#C0C0C0' : '#CD7F32',
  });
};

BadgeSchema.statics.createStreakBadge = async function (
  userId: mongoose.Types.ObjectId,
  streakCount: number
) {
  const type = streakCount >= 30 ? 'platinum' : streakCount >= 14 ? 'gold' : streakCount >= 7 ? 'silver' : 'bronze';
  const rarity = streakCount >= 30 ? 'legendary' : streakCount >= 14 ? 'epic' : 'rare';

  return this.create({
    userId,
    name: `${streakCount}-Day Streak`,
    description: `Maintained a ${streakCount}-day streak of completing challenges`,
    type,
    category: 'streak',
    achievedFor: `${streakCount}-day streak`,
    rarity,
    pointsAwarded: streakCount * 10,
    color: '#FF6B6B',
  });
};

// Use existing model if it exists, otherwise create it
const Badge = mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);

export default Badge;
