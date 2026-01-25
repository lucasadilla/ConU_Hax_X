'use client';

import { PhantomWalletConnect } from '@/components/PhantomWalletConnect';

interface ProfileClientWrapperProps {
  userId: string;
}

export function ProfileClientWrapper({ userId }: ProfileClientWrapperProps) {
  return <PhantomWalletConnect userId={userId} />;
}
