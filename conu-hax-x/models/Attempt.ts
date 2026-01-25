import mongoose, { Schema, Document } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";

// Connect to database
if (mongoose.connection.readyState === 0) {
  connectToDatabase().catch(console.error);
}

export interface IAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  solution?: string;
  code?: string;
  language?: string;
  timeSpent?: number;
  status?: 'pending' | 'completed' | 'error';
  testResults?: ITestResult[];
  evaluation?: any;
  score?: number;
  passed: boolean;
  badgeEarned: boolean; // Badge awarded on completion (off-chain)
  nftAddress?: string; // NFT address if minted to Phantom wallet (on-chain)
  nftMintedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestResult {
  testCaseIndex: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

const AttemptSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    solution: {
      type: String,
    },
    code: {
      type: String,
    },
    language: {
      type: String,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'error'],
      default: 'pending',
    },
    testResults: {
      type: [
        {
          testCaseIndex: Number,
          passed: Boolean,
          input: String,
          expectedOutput: String,
          actualOutput: String,
          error: String,
        },
      ],
      default: [],
    },
    evaluation: {
      type: Schema.Types.Mixed,
    },
    score: {
      type: Number,
    },
    passed: {
      type: Boolean,
      required: true,
      default: false,
    },
    badgeEarned: {
      type: Boolean,
      required: true,
      default: false,
    },
    nftAddress: {
      type: String,
    },
    nftMintedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index to prevent duplicate NFT minting per user per ticket
AttemptSchema.index({ userId: 1, ticketId: 1, nftAddress: 1 });

export default mongoose.models.Attempt || mongoose.model<IAttempt>("Attempt", AttemptSchema);
