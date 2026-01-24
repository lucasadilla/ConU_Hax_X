import { Keypair } from "@solana/web3.js";
import crypto from "crypto";

/**
 * Generate a new Solana wallet (keypair)
 */
export function generateWallet(): { publicKey: string; privateKey: string } {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  const privateKey = JSON.stringify(Array.from(keypair.secretKey));
  
  return { publicKey, privateKey };
}

/**
 * Encrypt a private key using AES-256-GCM
 */
export function encryptPrivateKey(privateKey: string, encryptionKey: string): string {
  const algorithm = "aes-256-gcm";
  const key = crypto.scryptSync(encryptionKey, "salt", 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  // Return IV + AuthTag + Encrypted data (all hex)
  return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt a private key
 */
export function decryptPrivateKey(encryptedData: string, encryptionKey: string): string {
  const algorithm = "aes-256-gcm";
  const key = crypto.scryptSync(encryptionKey, "salt", 32);
  
  const parts = encryptedData.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format");
  }
  
  const iv = Buffer.from(parts[0], "hex");
  const authTag = Buffer.from(parts[1], "hex");
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

/**
 * Generate and encrypt a wallet for a new user
 */
export function generateEncryptedWallet(encryptionKey: string): {
  publicKey: string;
  encryptedPrivateKey: string;
} {
  const { publicKey, privateKey } = generateWallet();
  const encryptedPrivateKey = encryptPrivateKey(privateKey, encryptionKey);
  
  return { publicKey, encryptedPrivateKey };
}
