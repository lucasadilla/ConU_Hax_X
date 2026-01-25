// Shared TypeScript types for core entities

export enum NFTType {
  BADGE = "badge",
  ACHIEVEMENT = "achievement",
  CERTIFICATE = "certificate",
  SKILL = "skill",
  MILESTONE = "milestone",
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  type?: NFTType;
  external_url?: string;
}

export interface MintNFTParams {
  userWallet: string;
  type: NFTType;
  name: string;
  description: string;
  imageUrl: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  externalUrl?: string;
}
