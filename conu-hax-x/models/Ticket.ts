import mongoose, { Schema, Document } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";

// Connect to database
if (mongoose.connection.readyState === 0) {
  connectToDatabase().catch(console.error);
}

export interface TicketExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TicketTestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface TicketCodeFile {
  filename?: string;
  name?: string;
  language: string;
  content: string;
  isReadOnly?: boolean;
  readOnly?: boolean;
}

export interface TicketDocsLink {
  title: string;
  url: string;
}

export interface ITicket extends Document {
  title: string;
  description: string;
  difficulty: string;
  language: string;
  isActive: boolean;
  tags: string[];
  examples: TicketExample[];
  constraints: string[];
  hints: string[];
  testCases: TicketTestCase[];
  codeFiles: TicketCodeFile[];
  category?: string;
  points?: number;
  timeLimit?: number;
  docsLinks?: TicketDocsLink[];
  attemptCount?: number;
  successCount?: number;
  averageScore?: number;
  successRate?: number;
  generatedBy?: string;
  prompt?: string;
  // NFT metadata for completion reward (optional)
  completionNFTName?: string;
  completionNFTDescription?: string;
  completionNFTImageUrl?: string;
  completionNFTAttributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;

  createdAt: Date;
  updatedAt: Date;
  recordAttempt: (score: number, success: boolean) => void;
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
    language: {
      type: String,
      default: "javascript",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    examples: {
      type: [
        {
          input: String,
          output: String,
          explanation: String,
        },
      ],
      default: [],
    },
    constraints: {
      type: [String],
      default: [],
    },
    hints: {
      type: [String],
      default: [],
    },
    testCases: {
      type: [
        {
          input: String,
          expectedOutput: String,
          isHidden: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
    codeFiles: {
      type: [
        {
          filename: String,
          name: String,
          language: String,
          content: String,
          isReadOnly: {
            type: Boolean,
            default: false,
          },
          readOnly: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
    category: {
      type: String,
      default: "General",
    },
    points: {
      type: Number,
      default: 0,
    },
    timeLimit: {
      type: Number,
    },
    docsLinks: {
      type: [
        {
          title: String,
          url: String,
        },
      ],
      default: [],
    },
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
    successRate: {
      type: Number,
      default: 0,
    },
    generatedBy: {
      type: String,
    },
    prompt: {
      type: String,
    },
    // NFT metadata fields (optional)
    completionNFTName: {
      type: String,
      default: "",
    },
    completionNFTDescription: {
      type: String,
      default: "",
    },
    completionNFTImageUrl: {
      type: String,
      default: "",
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

    validationCode: {
      type: String, // Automated test code to run against user solution
    },
    solutionCode: {
      type: String, // Reference solution
    },
  },
  {
    timestamps: true,
  }
);

TicketSchema.methods.recordAttempt = function recordAttempt(
  score: number,
  success: boolean
) {
  const currentAttempts = typeof this.attemptCount === "number" ? this.attemptCount : 0;
  const currentSuccess = typeof this.successCount === "number" ? this.successCount : 0;
  const currentAverage = typeof this.averageScore === "number" ? this.averageScore : 0;

  this.attemptCount = currentAttempts + 1;
  this.successCount = currentSuccess + (success ? 1 : 0);

  const totalScore = currentAverage * currentAttempts + score;
  this.averageScore = totalScore / this.attemptCount;
  this.successRate = this.attemptCount > 0
    ? Math.round((this.successCount / this.attemptCount) * 100)
    : 0;
};

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
