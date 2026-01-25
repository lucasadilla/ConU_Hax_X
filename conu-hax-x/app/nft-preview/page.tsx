'use client';

import { PhantomWalletConnect } from '@/components/PhantomWalletConnect';
import { UserBadgesDisplay } from '@/components/UserBadgesDisplay';
import { ChallengeCompletionNotification } from '@/components/ChallengeCompletionNotification';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

/**
 * Test/Preview page for NFT wallet integration components
 * This page is for development/testing purposes only
 * 
 * Access at: /nft-preview
 */
export default function NFTPreviewPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 
          className="text-4xl font-display mb-8 text-center"
          style={{ 
            color: '#fde047',
            textShadow: '3px 3px 0 rgba(0,0,0,0.5)',
          }}
        >
          NFT Wallet Components Preview
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                Phantom Wallet Connect
              </h2>
              <PhantomWalletConnect 
                userId="preview-user-id" 
                onConnected={(address, claimed) => {
                  console.log('Wallet connected:', address);
                  console.log('NFTs claimed:', claimed);
                }}
              />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                Completion: Badge + NFT
              </h2>
              <ChallengeCompletionNotification
                badgeEarned={true}
                nftMinted={true}
                walletConnected={true}
              />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                Completion: Badge Only
              </h2>
              <ChallengeCompletionNotification
                badgeEarned={true}
                nftMinted={false}
                walletConnected={false}
              />
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                User Badges Display
              </h2>
              <div 
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: 'rgba(30, 30, 46, 0.9)',
                  border: '3px solid #1e1e2e',
                  boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
                }}
              >
                <UserBadgesDisplay userId="preview-user-id" />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                Features
              </h2>
              <div 
                className="p-6 rounded-lg space-y-4"
                style={{
                  backgroundColor: 'rgba(30, 30, 46, 0.9)',
                  border: '3px solid #1e1e2e',
                  boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-bold text-yellow-400">Wallet Connection</h3>
                    <p className="text-sm text-slate-300">
                      Connect Phantom wallet to claim NFTs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎁</div>
                  <div>
                    <h3 className="font-bold text-yellow-400">Auto-Claim</h3>
                    <p className="text-sm text-slate-300">
                      Existing badges automatically minted as NFTs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔗</div>
                  <div>
                    <h3 className="font-bold text-yellow-400">NFT Indicators</h3>
                    <p className="text-sm text-slate-300">
                      Visual badges show which are minted as NFTs
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h3 className="font-bold text-yellow-400">Optional</h3>
                    <p className="text-sm text-slate-300">
                      Platform works perfectly without a wallet
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="mt-12 p-6 rounded-lg"
          style={{
            backgroundColor: 'rgba(253, 224, 71, 0.1)',
            border: '3px solid #fde047',
            boxShadow: '6px 6px 0 rgba(0,0,0,0.3)',
          }}
        >
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            📚 Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-bold text-white mb-2">User Guide</h3>
              <p className="text-slate-300 mb-2">
                Complete guide for users on connecting wallets and claiming NFTs
              </p>
              <code className="text-xs text-yellow-400">NFT_USER_GUIDE.md</code>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Technical Docs</h3>
              <p className="text-slate-300 mb-2">
                Developer documentation for the badge and NFT system
              </p>
              <code className="text-xs text-yellow-400">BADGE_AND_NFT_SYSTEM.md</code>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Implementation</h3>
              <p className="text-slate-300 mb-2">
                Summary of implementation, testing, and deployment
              </p>
              <code className="text-xs text-yellow-400">NFT_WALLET_INTEGRATION_SUMMARY.md</code>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
