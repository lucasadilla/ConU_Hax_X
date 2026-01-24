import mongoose, { Schema, Document } from "mongoose";
import connectDB from "@/lib/mongodb";

// Connect to database
if (mongoose.connection.readyState === 0) {
  connectDB();
}

export interface IUser extends Document {
  email: string;
  name: string;
  solanaWalletAddress?: string;
  solanaPrivateKey?: string; // Encrypted private key
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    solanaWalletAddress: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but enforces uniqueness for non-null
    },
    solanaPrivateKey: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
