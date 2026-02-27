import type { TransactionInstruction } from '@solana/web3.js'
import { ComputeBudgetProgram } from '@solana/web3.js'
import { defineStore } from 'pinia'
import { estimatePrioritizationFee } from './utils'
import PriorityFee from './components/PriorityFee.vue'
import {
  BASE_PRIORITY_FEE,
  DEFAULT_COMPUTE_UNITS,
  DEFAULT_EXACT_FEE,
  MICRO_LAMPORTS_PER_LAMPORT,
  PriorityLevel,
  PriorityMode,
} from './constants'
import { solToLamports } from '~/utils'

export * from './constants'
export { PriorityFee }

export const usePriorityFee = defineStore('priority-fee', () => {
  const mode = useLocalStorage<PriorityMode>('priorityMode', PriorityMode.MaxCap)
  const level = useLocalStorage<PriorityLevel>('priorityLevel', PriorityLevel.Turbo)
  const exactFee = useLocalStorage<number>('priorityFee', DEFAULT_EXACT_FEE)

  const baseFee = computed(() => {
    return BASE_PRIORITY_FEE[level.value] ?? 0
  })

  return {
    mode,
    level,
    exactFee,
    baseFee,
  }
})

export async function withPriorityFees({ computeUnits, instructions }: {
  computeUnits?: number
  instructions: TransactionInstruction[]
}): Promise<TransactionInstruction[]> {
  const connectionStore = useConnectionStore()
  const priorityFee = usePriorityFee()

  let estimate: number

  const units = computeUnits ?? DEFAULT_COMPUTE_UNITS
  const exactFee = solToLamports(priorityFee.exactFee) * MICRO_LAMPORTS_PER_LAMPORT
  const cuPriceMax = Math.abs(exactFee / units)

  if (priorityFee.mode === PriorityMode.ExactFee) {
    estimate = cuPriceMax
  } else {
    estimate = await estimatePrioritizationFee(connectionStore.connection, instructions, priorityFee.baseFee)
    console.log('[priority] Estimated CU price (mL): ', estimate)
    estimate = Math.min(estimate, cuPriceMax)
  }

  console.log('[priority] Used CU price (mL): ', estimate)
  console.log('[priority] Estimated prioritization fee: ', estimate * units / MICRO_LAMPORTS_PER_LAMPORT)

  return [
    ComputeBudgetProgram.setComputeUnitLimit({ units }),
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: estimate }),
    ...instructions,
  ]
}
