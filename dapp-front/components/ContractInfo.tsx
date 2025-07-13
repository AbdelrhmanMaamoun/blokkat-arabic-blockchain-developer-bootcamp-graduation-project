'use client'

import { useReadContract, useAccount } from 'wagmi'
import { SHADOW_ABI, SHADOW_ICO_ABI, SHADOW_TOKEN_ADDRESS, SHADOW_ICO_ADDRESS, formatTokenAmount } from '@/lib/contracts'

export default function ContractInfo() {
    const { address, isConnected } = useAccount()

    // Read contract data with improved caching and loading states
    const { data: tokenName, isLoading: nameLoading } = useReadContract({
        address: SHADOW_TOKEN_ADDRESS,
        abi: SHADOW_ABI,
        functionName: 'name',
        query: {
            staleTime: 5 * 60 * 1000, // Cache for 5 minutes
            gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
        },
    })

    const { data: tokenSymbol, isLoading: symbolLoading } = useReadContract({
        address: SHADOW_TOKEN_ADDRESS,
        abi: SHADOW_ABI,
        functionName: 'symbol',
        query: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
        },
    })

    const { data: totalSupply, isLoading: supplyLoading } = useReadContract({
        address: SHADOW_TOKEN_ADDRESS,
        abi: SHADOW_ABI,
        functionName: 'totalSupply',
        query: {
            staleTime: 30 * 1000, // Cache for 30 seconds (supply changes frequently)
            gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
            refetchInterval: 10 * 1000, // Refetch every 10 seconds
        },
    })

    const { data: icoRate, isLoading: rateLoading } = useReadContract({
        address: SHADOW_ICO_ADDRESS,
        abi: SHADOW_ICO_ABI,
        functionName: 'rate',
        query: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
        },
    })

    const { data: userBalance, isLoading: balanceLoading } = useReadContract({
        address: SHADOW_TOKEN_ADDRESS,
        abi: SHADOW_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && isConnected,
            staleTime: 10 * 1000, // Cache for 10 seconds
            gcTime: 30 * 1000, // Keep in cache for 30 seconds
            refetchInterval: 5 * 1000, // Refetch every 5 seconds
        },
    })

    const { data: icoOwner, isLoading: ownerLoading } = useReadContract({
        address: SHADOW_ICO_ADDRESS,
        abi: SHADOW_ICO_ABI,
        functionName: 'owner',
        query: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
        },
    })

    // Loading skeleton component
    const LoadingSkeleton = ({ className = "h-4" }: { className?: string }) => {
        return <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse rounded ${className}`}></div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Token Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">🐱</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {nameLoading ? <LoadingSkeleton className="h-6 w-20" /> : (tokenName ? String(tokenName) : 'Shadow')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {symbolLoading ? <LoadingSkeleton className="h-4 w-12" /> : (tokenSymbol ? String(tokenSymbol) : 'SHDW')}
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Supply:</span>
                        <span className="font-mono text-gray-900 dark:text-white">
                            {supplyLoading ? (
                                <LoadingSkeleton className="h-4 w-24" />
                            ) : (
                                `${totalSupply ? formatTokenAmount(totalSupply as bigint) : '0'} ${tokenSymbol || 'SHDW'}`
                            )}
                        </span>
                    </div>

                    {isConnected && address && (
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Your Balance:</span>
                            <span className="font-mono text-gray-900 dark:text-white">
                                {balanceLoading ? (
                                    <LoadingSkeleton className="h-4 w-20" />
                                ) : (
                                    `${userBalance ? formatTokenAmount(userBalance as bigint) : '0'} ${tokenSymbol || 'SHDW'}`
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ICO Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">I</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            ICO Contract
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Token Sale
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Exchange Rate:</span>
                        <span className="font-mono text-gray-900 dark:text-white">
                            {rateLoading ? (
                                <LoadingSkeleton className="h-4 w-16" />
                            ) : (
                                `${icoRate ? icoRate.toString() : '0'} SHDW per ETH`
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Contract Owner:</span>
                        <span className="font-mono text-xs text-gray-900 dark:text-white">
                            {ownerLoading ? (
                                <LoadingSkeleton className="h-4 w-20" />
                            ) : (
                                icoOwner ? `${(icoOwner as string).slice(0, 6)}...${(icoOwner as string).slice(-4)}` : 'Loading...'
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Contract Addresses */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Contract Addresses
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Scroll Sepolia
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Shadow Token:</span>
                        <div className="font-mono text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1 break-all">
                            {SHADOW_TOKEN_ADDRESS}
                        </div>
                    </div>

                    <div>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">ICO Contract:</span>
                        <div className="font-mono text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1 break-all">
                            {SHADOW_ICO_ADDRESS}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 