import type {
  Connection,
  RecentPrioritizationFees,
  TransactionInstruction } from '@solana/web3.js'
import {
  PublicKey,
} from '@solana/web3.js'

const MAX_RECENT_PRIORITY_FEE_ACCOUNTS = 128

/**
 * Returns an estimate of a prioritization fee for a set of instructions.
 *
 * The estimate is based on the median fees of writable accounts that will be involved in the transaction.
 *
 * @param connection
 * @param ixs - the instructions that make up the transaction
 * @param basePriorityFee
 * @returns prioritizationFeeEstimate -- in microLamports
 */
export async function estimatePrioritizationFee(
  connection: Connection,
  ixs: TransactionInstruction[],
  basePriorityFee?: number,
): Promise<number> {
  const writableAccounts = ixs
    .flatMap(ix => ix.keys.filter(a => a.isWritable).map(k => k.pubkey))

  const uniqueWritableAccounts = [...new Set(writableAccounts.map(x => x.toBase58()))]
    .slice(0, MAX_RECENT_PRIORITY_FEE_ACCOUNTS)
    .map(a => new PublicKey(a))

  const priorityFees = await connection.getRecentPrioritizationFees({
    lockedWritableAccounts: uniqueWritableAccounts,
  })

  // If no priority fees are found, return the base priority fee or 1 as the default
  if (priorityFees.length === 0) {
    return Math.max(basePriorityFee ?? 0, 1)
  }

  const maxFeeBySlot = priorityFees.reduce((acc, fee) => {
    if (!acc[fee.slot] || fee.prioritizationFee > (acc[fee.slot]?.prioritizationFee ?? 0)) {
      acc[fee.slot] = fee
    }
    return acc
  }, {} as Record<number, RecentPrioritizationFees>)

  const sortedMaxFees = Object.values(maxFeeBySlot).sort((a, b) => a.slot - b.slot)

  // Get the median of the last 100 fees
  const recentFees = sortedMaxFees.slice(-100)
  if (recentFees.length === 0) {
    return Math.max(basePriorityFee ?? 1, 1)
  }

  const mid = Math.floor(recentFees.length / 2)
  const medianFee = recentFees.length % 2 !== 0
    ? recentFees[mid]?.prioritizationFee ?? 0
    : ((recentFees[mid - 1]?.prioritizationFee ?? 0) + (recentFees[mid]?.prioritizationFee ?? 0)) / 2

  return Math.max(basePriorityFee ?? 1, Math.ceil(medianFee))
}

/**
 * Function to allow only numbers and a single decimal point to be inputted.
 *
 * @param {any} e - event parameter
 */
export function onlyNumber(e: any) {
  const keyCode = e.keyCode ? e.keyCode : e.which
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    e.preventDefault()
  }
  if (keyCode === 46 && String(e.target.value).includes('.')) {
    e.preventDefault()
  }
}
