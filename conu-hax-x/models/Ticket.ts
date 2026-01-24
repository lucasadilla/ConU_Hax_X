import mongoose, { Schema, Document } from "mongoose";
import connectDB from "@/lib/mongodb";

// Connect to database
if (mongoose.connection.readyState === 0) {
  connectDB();
}

export interface ITicket extends Document {
  title: string;
  description: string;
  difficulty: string;
  // NFT metadata for completion reward
  completionNFTName: string;
  completionNFTDescription: string;
  completionNFTImageUrl: string;
  completionNFTAttributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  createdAt: Date;
  updatedAt: Date;
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
