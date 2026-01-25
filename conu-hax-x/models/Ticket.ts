import mongoose, { Schema, Document } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";

// Connect to database
if (mongoose.connection.readyState === 0) {
  connectToDatabase().catch(console.error);
}

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description?: string;
}

export interface ITicket extends Document {
  title: string;
  description: string;
  difficulty: string;
  scenario?: string;
  
  // Code and tests
  startingCode: string;
  testCases: ITestCase[];
  requirements: string[];
  hints?: string[];
  acceptanceCriteria: string[];
  
  // NFT metadata for completion reward
  completionNFTName: string;
  completionNFTDescription: string;
  completionNFTImageUrl: string;
  completionNFTAttributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  
  // Metadata
  language: string;
  category?: string;
  tags: string[];
  points: number;
  estimatedMinutes: number;
  
  // Statistics
  attemptCount: number;
  successCount: number;
  averageScore: number;
  
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  recordAttempt(score: number, success: boolean): void;
}

const TicketSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    scenario: {
      type: String,
    },
    
    // Code and tests
    startingCode: {
      type: String,
      required: true,
      default: "// Start coding here\n",
    },
    testCases: {
      type: [
        {
          input: { type: String, required: true },
          expectedOutput: { type: String, required: true },
          isHidden: { type: Boolean, default: false },
          description: { type: String },
        },
      ],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    hints: {
      type: [String],
      default: [],
    },
    acceptanceCriteria: {
      type: [String],
      default: [],
    },
    
    // NFT metadata fields
    completionNFTName: {
      type: String,
      required: true,
    },
    completionNFTDescription: {
      type: String,
      required: true,
    },
    completionNFTImageUrl: {
      type: String,
      required: true,
    },
    completionNFTAttributes: {
      type: [
        {
          trait_type: String,
          value: Schema.Types.Mixed, // Can be string or number
        },
      ],
      default: [],
    },
    
    // Metadata
    language: {
      type: String,
      default: "typescript",
    },
    category: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    points: {
      type: Number,
      default: 100,
    },
    estimatedMinutes: {
      type: Number,
      default: 30,
    },
    
    // Statistics
    attemptCount: {
      type: Number,
      default: 0,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to record attempt statistics
TicketSchema.methods.recordAttempt = function(score: number, success: boolean) {
  this.attemptCount += 1;
  if (success) {
    this.successCount += 1;
  }
  
  // Update average score
  if (this.attemptCount === 1) {
    this.averageScore = score;
  } else {
    this.averageScore = 
      (this.averageScore * (this.attemptCount - 1) + score) / this.attemptCount;
  }
};

// Indexes
TicketSchema.index({ difficulty: 1, isActive: 1 });
TicketSchema.index({ category: 1, isActive: 1 });
TicketSchema.index({ tags: 1 });

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
