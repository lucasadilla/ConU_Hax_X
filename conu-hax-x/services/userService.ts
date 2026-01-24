import User, { IUser } from "@/models/User";
import { generateEncryptedWallet } from "@/lib/wallet";
import mongoose from "mongoose";

const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY || "default-encryption-key-change-in-production";

/**
 * Generate and assign a Solana wallet to an existing user
 * This should be called after NextAuth signup completes
 * 
 * @param userId - The user's ID (can be MongoDB ObjectId or string)
 * @returns The updated user with wallet, or null if user not found
 * 
 * @example
 * // In NextAuth signIn callback or after user creation:
 * await generateWalletForUser(user.id);
 */
export async function generateWalletForUser(
  userId: string | mongoose.Types.ObjectId
): Promise<IUser | null> {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error(`User ${userId} not found`);
      return null;
    }

    // If user already has a wallet, return existing user (idempotent)
    if (user.solanaWalletAddress && user.solanaPrivateKey) {
      console.log(`User ${userId} already has a wallet: ${user.solanaWalletAddress}`);
      return user;
    }

    // Generate and encrypt wallet
    const { publicKey, encryptedPrivateKey } = generateEncryptedWallet(ENCRYPTION_KEY);

    // Update user with wallet
    user.solanaWalletAddress = publicKey;
    user.solanaPrivateKey = encryptedPrivateKey;
    await user.save();

    console.log(`Generated wallet ${publicKey} for user ${userId}`);
    return user;
  } catch (error) {
    console.error(`Failed to generate wallet for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Generate wallet for user by email (alternative method)
 * Useful if you only have the email from NextAuth
 */
export async function generateWalletForUserByEmail(
  email: string
): Promise<IUser | null> {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`User with email ${email} not found`);
      return null;
    }

    return await generateWalletForUser(user._id);
  } catch (error) {
    console.error(`Failed to generate wallet for user with email ${email}:`, error);
    throw error;
  }
}

/**
 * Create a new user with a generated Solana wallet
 * (Legacy function - use generateWalletForUser after NextAuth signup instead)
 */
export async function createUserWithWallet(
  email: string,
  name: string
): Promise<IUser> {
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Generate and encrypt wallet
  const { publicKey, encryptedPrivateKey } = generateEncryptedWallet(ENCRYPTION_KEY);

  // Create user
  const user = new User({
    email: email.toLowerCase(),
    name,
    solanaWalletAddress: publicKey,
    solanaPrivateKey: encryptedPrivateKey,
  });

  await user.save();

  return user;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<IUser | null> {
  return await User.findById(userId);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<IUser | null> {
  return await User.findOne({ email: email.toLowerCase() });
}

/**
 * Check if user has a wallet
 */
export async function userHasWallet(userId: string | mongoose.Types.ObjectId): Promise<boolean> {
  const user = await User.findById(userId);
  return !!(user?.solanaWalletAddress && user?.solanaPrivateKey);
}
