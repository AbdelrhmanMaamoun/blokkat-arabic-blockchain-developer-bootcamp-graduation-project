'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState } from 'react'

export default function WalletConnect() {
    const { address, isConnected } = useAccount()
    const { connect, connectors, isPending } = useConnect()
    const { disconnect } = useDisconnect()
    const [isConnecting, setIsConnecting] = useState(false)

    const handleConnect = async () => {
        setIsConnecting(true)
        try {
            const connector = connectors.find(c => c.name === 'MetaMask')
            if (connector) {
                await connect({ connector })
            }
        } catch (error) {
            console.error('Failed to connect:', error)
        } finally {
            setIsConnecting(false)
        }
    }

    const handleDisconnect = () => {
        disconnect()
    }

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                    Connected
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg text-sm font-mono">
                    {formatAddress(address)}
                </div>
                <button
                    onClick={handleDisconnect}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Disconnect
                </button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                Not Connected
            </div>
            <button
                onClick={handleConnect}
                disabled={isConnecting || isPending}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
                {isConnecting || isPending ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Connecting...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.5 12.5l7-4.5-7-4.5v9z" />
                        </svg>
                        Connect Wallet
                    </>
                )}
            </button>
        </div>
    )
} 