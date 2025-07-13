'use client'

import { useReadContract, useWatchContractEvent } from 'wagmi'
import { useState, useEffect } from 'react'
import { SHADOW_ICO_ABI, SHADOW_ICO_ADDRESS, formatTokenAmount, formatETHAmount } from '@/lib/contracts'

interface Transaction {
    id: string
    type: 'purchase' | 'withdrawal'
    buyer: string
    ethAmount: bigint
    tokenAmount: bigint
    timestamp: number
}

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    // Watch for TokensPurchased events
    useWatchContractEvent({
        address: SHADOW_ICO_ADDRESS,
        abi: SHADOW_ICO_ABI,
        eventName: 'TokensPurchased',
        onLogs: (logs) => {
            logs.forEach((log) => {
                if (log.transactionHash && log.args.buyer && log.args.ethAmount && log.args.tokenAmount) {
                    const newTransaction: Transaction = {
                        id: log.transactionHash,
                        type: 'purchase',
                        buyer: log.args.buyer,
                        ethAmount: log.args.ethAmount,
                        tokenAmount: log.args.tokenAmount,
                        timestamp: Date.now(),
                    }
                    setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]) // Keep last 10
                }
            })
        },
    })

    // Watch for ETHWithdrawn events
    useWatchContractEvent({
        address: SHADOW_ICO_ADDRESS,
        abi: SHADOW_ICO_ABI,
        eventName: 'ETHWithdrawn',
        onLogs: (logs) => {
            logs.forEach((log) => {
                if (log.transactionHash && log.args.owner && log.args.amount) {
                    const newTransaction: Transaction = {
                        id: log.transactionHash,
                        type: 'withdrawal',
                        buyer: log.args.owner,
                        ethAmount: log.args.amount,
                        tokenAmount: BigInt(0),
                        timestamp: Date.now(),
                    }
                    setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]) // Keep last 10
                }
            })
        },
    })

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    const formatTime = (timestamp: number) => {
        const now = Date.now()
        const diff = now - timestamp

        if (diff < 60000) return 'Just now'
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
        return `${Math.floor(diff / 86400000)}d ago`
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Recent Transactions
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Live updates from the ICO contract
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {transactions.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            No transactions yet. Buy some tokens to see activity here!
                        </p>
                    </div>
                ) : (
                    transactions.map((tx) => (
                        <div
                            key={tx.id}
                            className={`p-4 rounded-lg border ${tx.type === 'purchase'
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center ${tx.type === 'purchase'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-yellow-500 text-white'
                                            }`}
                                    >
                                        {tx.type === 'purchase' ? (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {tx.type === 'purchase' ? 'Token Purchase' : 'ETH Withdrawal'}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatTime(tx.timestamp)}
                                </span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex justify-between mb-1">
                                    <span>Address:</span>
                                    <span className="font-mono">{formatAddress(tx.buyer)}</span>
                                </div>

                                {tx.type === 'purchase' ? (
                                    <>
                                        <div className="flex justify-between mb-1">
                                            <span>ETH Sent:</span>
                                            <span className="font-mono">{formatETHAmount(tx.ethAmount)} ETH</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tokens Received:</span>
                                            <span className="font-mono">{formatTokenAmount(tx.tokenAmount)} SHDW</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between">
                                        <span>ETH Withdrawn:</span>
                                        <span className="font-mono">{formatETHAmount(tx.ethAmount)} ETH</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
} 