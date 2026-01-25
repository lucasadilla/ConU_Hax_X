import mongoose, { Schema, Document } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";

// Connect to database
if (mongoose.connection.readyState === 0) {
  connectToDatabase().catch(console.error);
}

export interface ITestResult {
  testCaseIndex: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
  isHidden?: boolean;
}

export interface IAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  timeSpent: number; // in seconds
  
  // Test execution
  status: 'pending' | 'running' | 'completed' | 'error';
  testResults: ITestResult[];
  
  // Evaluation
  evaluation?: {
    passed: boolean;
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  };
  
  score?: number;
  passed: boolean;
  
  // Badge and NFT tracking
  badgeEarned: boolean; // Badge awarded on completion (off-chain)
  nftAddress?: string; // NFT address if minted to Phantom wallet (on-chain)
  nftMintedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const AttemptSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: 'typescript',
    },
    timeSpent: {
      type: Number,
      required: true,
      default: 0,
    },
    
    // Test execution
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'error'],
      default: 'pending',
    },
    testResults: {
      type: [{
        testCaseIndex: Number,
        passed: Boolean,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        error: String,
        isHidden: { type: Boolean, default: false },
      }],
      default: [],
    },
    
    // Evaluation
    evaluation: {
      type: {
        passed: Boolean,
        score: Number,
        feedback: String,
        strengths: [String],
        improvements: [String],
      },
    },
    
    score: {
      type: Number,
    },
    passed: {
      type: Boolean,
      required: true,
      default: false,
    },
    
    // Badge and NFT tracking
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

// Indexes
AttemptSchema.index({ userId: 1, ticketId: 1 });
AttemptSchema.index({ userId: 1, createdAt: -1 });
AttemptSchema.index({ userId: 1, ticketId: 1, nftAddress: 1 });

export default mongoose.models.Attempt || mongoose.model<IAttempt>("Attempt", AttemptSchema);
