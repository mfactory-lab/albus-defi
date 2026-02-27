export enum PriorityMode {
  MaxCap,
  ExactFee,
}

export enum PriorityLevel {
  Fast = 'fast',
  Turbo = 'turbo',
  Ultra = 'ultra',
}

export const BASE_PRIORITY_FEE = {
  [PriorityLevel.Fast]: 100_000,
  [PriorityLevel.Turbo]: 1_000_000,
  [PriorityLevel.Ultra]: 5_000_000,
}

export const MICRO_LAMPORTS_PER_LAMPORT = 1000000
export const DEFAULT_EXACT_FEE = 0.003
export const DEFAULT_COMPUTE_UNITS = 200000
