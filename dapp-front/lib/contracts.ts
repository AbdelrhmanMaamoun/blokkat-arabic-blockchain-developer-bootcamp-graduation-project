import type { Address } from 'viem'

// Import Foundry-generated ABIs
import shadowAbi from '../abi/Shadow.json'
import shadowIcoAbi from '../abi/ShadowICO.json'

// Contract addresses on Scroll Sepolia
export const SHADOW_TOKEN_ADDRESS = '0xD2Ce9C0B385fB2f8b0F1254933142dDd36a4f99f' as Address
export const SHADOW_ICO_ADDRESS = '0x8B2Af207A99Aa28bc37c8834c40B432AE01d654C' as Address

// Contract ABIs from Foundry build output
export const SHADOW_ABI = shadowAbi.abi
export const SHADOW_ICO_ABI = shadowIcoAbi.abi

// Contract configurations
export const contracts = {
    shadow: {
        address: SHADOW_TOKEN_ADDRESS,
        abi: SHADOW_ABI,
    },
    shadowIco: {
        address: SHADOW_ICO_ADDRESS,
        abi: SHADOW_ICO_ABI,
    },
} as const

// Token details
export const TOKEN_DETAILS = {
    name: 'Shadow',
    symbol: 'SHDW',
    decimals: 18,
} as const

// Utility function to format token amounts
export const formatTokenAmount = (amount: bigint, decimals: number = 18): string => {
    const divisor = BigInt(10 ** decimals)
    const whole = amount / divisor
    const fraction = amount % divisor

    if (fraction === BigInt(0)) {
        return whole.toString()
    }

    const fractionStr = fraction.toString().padStart(decimals, '0')
    const trimmedFraction = fractionStr.replace(/0+$/, '')

    return `${whole}.${trimmedFraction}`
}

// Utility function to format ETH amounts
export const formatETHAmount = (amount: bigint): string => {
    const ethValue = Number(amount) / 1e18
    return ethValue.toFixed(4)
} 