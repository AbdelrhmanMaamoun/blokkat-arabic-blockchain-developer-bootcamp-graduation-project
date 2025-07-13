'use client'

import WalletConnect from '@/components/WalletConnect'
import ContractInfo from '@/components/ContractInfo'
import BuyTokens from '@/components/BuyTokens'
import TransactionHistory from '@/components/TransactionHistory'
import { useReadContract } from 'wagmi'
import { SHADOW_ICO_ABI, SHADOW_ICO_ADDRESS } from '@/lib/contracts'

export default function Home() {
  // Read ICO rate
  const { data: icoRate } = useReadContract({
    address: SHADOW_ICO_ADDRESS,
    abi: SHADOW_ICO_ABI,
    functionName: 'rate',
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🐱</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Shadow
              </h1>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🐾🐈 Welcome to Shadow Token 🐈🐾
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Meet Shadow — my beloved cat —  with a mission to make the world a better place for all furry friends.
            <br />
            Join her mission on Scroll Sepolia: send ETH to receive SHDW tokens and help Shadow spread love to animals everywhere.
          </p>
        </div>

        {/* Buy Tokens - Main Section */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Buy SHDW Tokens
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Current Rate: 1 ETH = {icoRate ? Number(icoRate).toLocaleString() : '...'} SHDW tokens
              </p>
            </div>

            <BuyTokens />
          </div>
        </div>

        {/* Contract Information */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Contract Information
          </h3>
          <ContractInfo />
        </div>

        {/* Transaction History */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Transaction History
          </h3>
          <TransactionHistory />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              Shadow ICO dApp - Built with Next.js, Wagmi, and Tailwind CSS
            </p>
            <p className="text-sm">
              Connect your MetaMask wallet to Scroll Sepolia to participate in the token sale
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
