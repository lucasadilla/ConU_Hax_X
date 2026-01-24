import mongoose, { Schema, Document } from "mongoose";
import connectDB from "@/lib/mongodb";

// Connect to database
if (mongoose.connection.readyState === 0) {
  connectDB();
}

export interface IAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  solution: string;
  score?: number;
  passed: boolean;
  nftAddress?: string; // NFT address if minted
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
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
    },
    passed: {
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
