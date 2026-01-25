// MongoDB User model
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;

  // Stats
  totalPoints: number;
  ticketsCompleted: number;
  ticketsAttempted: number;

  // Streak tracking
  currentStreak: number;
  longestStreak: number;
  lastSubmissionDate?: Date;
  streakStartDate?: Date;
  totalDaysActive: number;

  // Badges
  badges: mongoose.Types.ObjectId[];
  level: number;
  experience: number;

  // Preferences
  preferredLanguage: string;
  difficulty: 'easy' | 'medium' | 'hard';

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },

    // Stats
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    ticketsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    ticketsAttempted: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Streak tracking
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastSubmissionDate: {
      type: Date,
      default: null,
    },
    streakStartDate: {
      type: Date,
      default: null,
    },
    totalDaysActive: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Badges
    badges: [{
      type: Schema.Types.ObjectId,
      ref: 'Badge',
    }],
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Preferences
    preferredLanguage: {
      type: String,
      default: 'javascript',
      enum: ['javascript', 'python', 'typescript', 'java', 'cpp', 'go', 'rust'],
    },
    difficulty: {
      type: String,
      default: 'easy',
      enum: ['easy', 'medium', 'hard'],
    },

    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ totalPoints: -1 });
UserSchema.index({ experience: -1 }); // For XP leaderboard
UserSchema.index({ currentStreak: -1 }); // For streak leaderboard
UserSchema.index({ ticketsCompleted: -1 }); // For completed leaderboard
UserSchema.index({ createdAt: -1 });

// Methods
UserSchema.methods.addPoints = function (points: number) {
  this.totalPoints += points;
  this.experience += points;

  // Level up logic (100 XP per level)
  const newLevel = Math.floor(this.experience / 100) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
  }
};

UserSchema.methods.completeTicket = function (points: number) {
  this.ticketsCompleted += 1;
  this.addPoints(points);
  this.currentStreak += 1;

  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
};

UserSchema.methods.resetStreak = function () {
  this.currentStreak = 0;
};

// Use existing model if it exists, otherwise create it
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
