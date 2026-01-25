import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { NFTType, NFTMetadata, MintNFTParams } from "@/types";

// Initialize Solana connection and Metaplex (lazy-loaded)
let connection: Connection | null = null;
let metaplex: Metaplex | null = null;
let initializationError: Error | null = null;

function initializeSolana() {
  // Return early if already initialized
  if (metaplex) return;
  
  // Return early if already failed
  if (initializationError) {
    throw initializationError;
  }

  // Check for required environment variables
  if (!process.env.SOLANA_PRIVATE_KEY) {
    initializationError = new Error(
      "SOLANA_PRIVATE_KEY environment variable is not set. NFT minting will not work until configured."
    );
    console.warn(
      "⚠️ Solana not configured: SOLANA_PRIVATE_KEY missing. NFT features disabled."
    );
    throw initializationError;
  }

  try {
    const secret = JSON.parse(process.env.SOLANA_PRIVATE_KEY);
    const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));
    connection = new Connection(
      process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
      "confirmed"
    );
    metaplex = Metaplex.make(connection).use(keypairIdentity(keypair));
    console.log("✅ Solana initialized successfully");
  } catch (error) {
    initializationError = new Error(
      `Failed to initialize Solana: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    throw initializationError;
  }
}

// Helper to check if Solana is configured
export function isSolanaConfigured(): boolean {
  return !!process.env.SOLANA_PRIVATE_KEY && !initializationError;
}

/**
 * Uploads NFT metadata to a storage solution
 * For production, use IPFS (via Pinata, NFT.Storage) or Arweave
 * For development, returns a data URI (not recommended for production)
 */
async function uploadMetadata(metadata: NFTMetadata): Promise<string> {
  // TODO: Replace with proper IPFS/Arweave upload in production
  // Example: const ipfsUrl = await uploadToIPFS(metadata);
  // For now, using data URI (works but not ideal for production)
  
  const metadataJson = JSON.stringify(metadata);
  const base64 = Buffer.from(metadataJson).toString("base64");
  return `data:application/json;base64,${base64}`;
}

/**
 * Gets default attributes based on NFT type
 */
function getDefaultAttributes(type: NFTType, customAttributes: MintNFTParams["attributes"]) {
  const baseAttributes = [
    { trait_type: "Type", value: type },
    ...customAttributes,
  ];
  return baseAttributes;
}

/**
 * Generic NFT minting function that supports multiple NFT types
 */
export async function mintNFT(params: MintNFTParams): Promise<string> {
  try {
    // Initialize Solana if not already done
    if (!metaplex) {
      initializeSolana();
    }

    if (!metaplex) {
      throw new Error("Solana is not configured");
    }

    // Validate wallet address
    try {
      new PublicKey(params.userWallet);
    } catch {
      throw new Error(`Invalid wallet address: ${params.userWallet}`);
    }

    // Build metadata
    const metadata: NFTMetadata = {
      name: params.name,
      description: params.description,
      image: params.imageUrl,
      attributes: getDefaultAttributes(params.type, params.attributes),
      type: params.type,
      external_url: params.externalUrl,
    };

    // Upload metadata and get URI
    const uri = await uploadMetadata(metadata);

    // Mint the NFT
    const { nft } = await metaplex.nfts().create({
      uri,
      name: params.name,
      sellerFeeBasisPoints: 0,
      tokenOwner: new PublicKey(params.userWallet),
    });

    return nft.address.toString();
  } catch (error) {
    throw new Error(
      `Failed to mint NFT: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Convenience function for minting badge NFTs (backward compatibility)
 */
export async function mintBadgeNFT(
  userWallet: string,
  name: string,
  description: string,
  imageUrl: string,
  attributes: Array<{ trait_type: string; value: string | number }>
): Promise<string> {
  return mintNFT({
    userWallet,
    type: NFTType.BADGE,
    name,
    description,
    imageUrl,
    attributes,
  });
}

/**
 * Mint an achievement NFT
 */
export async function mintAchievementNFT(
  userWallet: string,
  name: string,
  description: string,
  imageUrl: string,
  attributes: Array<{ trait_type: string; value: string | number }>
): Promise<string> {
  return mintNFT({
    userWallet,
    type: NFTType.ACHIEVEMENT,
    name,
    description,
    imageUrl,
    attributes,
  });
}

/**
 * Mint a certificate NFT
 */
export async function mintCertificateNFT(
  userWallet: string,
  name: string,
  description: string,
  imageUrl: string,
  attributes: Array<{ trait_type: string; value: string | number }>
): Promise<string> {
  return mintNFT({
    userWallet,
    type: NFTType.CERTIFICATE,
    name,
    description,
    imageUrl,
    attributes,
  });
}
