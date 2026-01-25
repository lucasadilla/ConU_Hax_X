import User, { IUser } from "@/models/User";

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
 * Check if user has connected their Phantom wallet
 */
export async function userHasConnectedWallet(userId: string): Promise<boolean> {
  const user = await User.findById(userId);
  return !!user?.phantomWalletAddress;
}
