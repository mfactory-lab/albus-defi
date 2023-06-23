import { BN } from '@coral-xyz/anchor'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Decimal } from 'decimal.js'

const SOL_DECIMALS = 9

export const formatPct = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 5,
})

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat().format(date)
}

export function formatBalance(balance: number, precision = 5) {
  return balance > 0 ? balance.toFixed(precision) : 0
}

export function solToLamports(amount: number | string) {
  return new Decimal(Number(amount)).mul(new Decimal(LAMPORTS_PER_SOL)).round().toNumber()
}

export function lamportsToSol(lamports: number | bigint | BN) {
  if (typeof lamports === 'number') {
    return Number(Number(Math.abs(lamports) / LAMPORTS_PER_SOL).toFixed(SOL_DECIMALS))
  }
  lamports = new BN(String(lamports))
  let signMultiplier = 1
  if (lamports.isNeg()) {
    signMultiplier = -1
  }
  const absLamports = lamports.abs()
  const lamportsString = absLamports.toString(10).padStart(10, '0')
  const splitIndex = lamportsString.length - SOL_DECIMALS
  const solString = `${lamportsString.slice(0, splitIndex)}.${lamportsString.slice(splitIndex)}`
  return signMultiplier * Number.parseFloat(solString)
}
