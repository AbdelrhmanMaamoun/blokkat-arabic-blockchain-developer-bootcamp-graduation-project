'use client'

import { useWriteContract, useReadContract, useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { useState } from 'react'
import { SHADOW_ICO_ABI, SHADOW_ICO_ADDRESS, formatTokenAmount, formatETHAmount } from '@/lib/contracts'

export default function BuyTokens() {
    const { address, isConnected } = useAccount()
    const [ethAmount, setEthAmount] = useState('')
    const [hash, setHash] = useState<`0x${string}` | undefined>()

    // Read ICO rate
    const { data: icoRate } = useReadContract({
        address: SHADOW_ICO_ADDRESS,
        abi: SHADOW_ICO_ABI,
        functionName: 'rate',
    })

    // Write contract for buying tokens
    const { writeContract, isPending, error } = useWriteContract()

    // Wait for transaction
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const handleBuyTokens = async () => {
        if (!ethAmount || !isConnected) return

        const ethValue = parseFloat(ethAmount)
        if (isNaN(ethValue) || ethValue <= 0) {
            alert('Please enter a valid ETH amount')
            return
        }

        try {
            writeContract({
                address: SHADOW_ICO_ADDRESS,
                abi: SHADOW_ICO_ABI,
                functionName: 'buyTokens',
                value: BigInt(Math.floor(ethValue * 1e18)),
            })
        } catch (err) {
            console.error('Failed to buy tokens:', err)
        }
    }

    const calculateTokens = () => {
        if (!ethAmount || !icoRate) return '0'
        const ethValue = parseFloat(ethAmount)
        if (isNaN(ethValue)) return '0'
        return (ethValue * Number(icoRate as bigint)).toLocaleString()
    }

    const resetForm = () => {
        setEthAmount('')
        setHash(undefined)
    }

    if (!isConnected) {
        return (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-4">
                    Connect Your Wallet
                </h3>
                <p className="text-lg text-yellow-700 dark:text-yellow-300">
                    Please connect your wallet to buy Shadow tokens.
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Exchange Rate Banner */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 mb-8 text-white text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-3xl">🐱</span>
                    <span className="text-2xl font-bold">Current Exchange Rate</span>
                </div>
                <p className="text-xl">
                    1 ETH = <span className="font-bold text-2xl">{icoRate ? Number(icoRate as bigint).toLocaleString() : '...'}</span> SHDW tokens
                </p>
            </div>

            {/* Buy Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8">
                <div className="space-y-6">
                    {/* ETH Input */}
                    <div key="eth-input">
                        <label htmlFor="ethAmount" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Amount of ETH to Send
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                id="ethAmount"
                                value={ethAmount}
                                onChange={(e) => setEthAmount(e.target.value)}
                                placeholder="0.0"
                                step="0.01"
                                min="0.001"
                                className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                                disabled={isPending || isConfirming}
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg font-medium">
                                ETH
                            </div>
                        </div>
                    </div>

                    {/* Token Calculation */}
                    {ethAmount && icoRate && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
                            <div className="text-center">
                                <p className="text-green-700 dark:text-green-300 text-lg mb-2">You will receive:</p>
                                <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                                    {calculateTokens()} SHDW tokens
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Buy Button */}
                    <button
                        onClick={handleBuyTokens}
                        disabled={!ethAmount || isPending || isConfirming}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-3"
                    >
                        {isPending || isConfirming ? (
                            <>
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                {isPending ? 'Confirming Transaction...' : 'Processing Transaction...'}
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                </svg>
                                Buy SHDW Tokens
                            </>
                        )}
                    </button>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="text-red-800 dark:text-red-200 font-semibold text-lg">Transaction Failed</span>
                            </div>
                            <p className="text-red-700 dark:text-red-300">
                                Error: {String(error?.message || 'Unknown error')}
                            </p>
                        </div>
                    )}

                    {/* Success Message */}
                    {isSuccess && (
                        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-800 dark:text-green-200 font-bold text-xl">
                                    Transaction Successful!
                                </span>
                            </div>
                            <p className="text-green-700 dark:text-green-300 text-lg mb-4">
                                Your SHDW tokens have been minted successfully to your wallet.
                            </p>
                            <button
                                onClick={resetForm}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Buy More Tokens
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 