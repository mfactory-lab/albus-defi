import { BN } from '@coral-xyz/anchor'
import { Decimal } from 'decimal.js'

const SOL_DECIMALS = 9

export const formatPct = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat().format(date)
}

export function formatBalance(balance: number, precision = 5) {
  return balance > 0 ? balance.toFixed(precision) : 0
}

export function solToLamports(amount: number | string, decimals = SOL_DECIMALS) {
  return new Decimal(Number(amount)).mul(new Decimal(10 ** decimals)).round().toNumber()
}

export function lamportsToSol(lamports: number | bigint | BN, decimals = SOL_DECIMALS) {
  if (typeof lamports === 'number') {
    return Number(Number(Math.abs(lamports) / (10 ** decimals)).toFixed(decimals))
  }
  lamports = new BN(String(lamports))
  let signMultiplier = 1
  if (lamports.isNeg()) {
    signMultiplier = -1
  }
  const absLamports = lamports.abs()
  const lamportsString = absLamports.toString(10).padStart(10, '0')
  const splitIndex = lamportsString.length - decimals
  const solString = `${lamportsString.slice(0, splitIndex)}.${lamportsString.slice(splitIndex)}`
  return signMultiplier * Number.parseFloat(solString)
}

/**
 * Remove all empty space, new line, etc. symbols
 * In some reason such symbols parsed back from Buffer looks weird
 * like "\x0000" instead of usual spaces.
 */
export function sanitizeString(str: string): string {
  return str.replace(/\0/g, '')
}

export function divideBnToNumber(numerator: BN, denominator: BN): number {
  if (denominator.isZero()) {
    return 0
  }
  const quotient = numerator.div(denominator).toNumber()
  const rem = numerator.umod(denominator)
  const gcd = rem.gcd(denominator)
  return quotient + rem.div(gcd).toNumber() / denominator.div(gcd).toNumber()
}
