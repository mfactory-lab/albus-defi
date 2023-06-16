import { defineStore } from 'pinia'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import Decimal from 'decimal.js'
import { getMint } from '@solana/spl-token'
import { useAnchorWallet } from 'solana-wallets-vue'
import { TokenSwap } from '@/spl/src'
import { getTokensByOwner, lamportsToSol } from '@/utils'
import { mintToken } from '@/utils/pool'

const POOL_ADDRESS = new PublicKey('4MZyn54Mh2FRW4tDaU2Au3GQHm4JNakSseMGUijWaQJP')

export enum PoolTokenSymbol {
  TOKEN_A = 'TOKEN_A',
  TOKEN_B = 'TOKEN_B',
  JPLU = 'JPLU',
}

interface SwapStoreBalance {
  SOL: number | undefined
  USDC: number | undefined
  JPLU: number | undefined
}
interface SwapStoreState {
  loading: boolean
  poolTokenSupply: number
  poolBalance: { [key: string]: any }
  userBalance: { [key: string]: any }
  rate: number
  slippageDialog: boolean
  status?: number
}

export const useSwapStore = defineStore('swap', () => {
  const tokenSwap = ref<TokenSwap | undefined>()

  const state = reactive<SwapStoreState>({
    loading: false,
    slippageDialog: false,
    status: undefined,
    poolBalance: { TOKEN_A: undefined, TOKEN_B: undefined, JPLU: undefined },
    userBalance: { TOKEN_A: undefined, TOKEN_B: undefined, JPLU: undefined },
    poolTokenSupply: 0,
    rate: 0,
  })

  const connectionStore = useConnectionStore()
  const wallet = useAnchorWallet()

  watch(wallet, async (w) => {
    if (w) {
      await loadUserTokenAccounts()
      // initPool(connectionStore.connection, w)

      await mintToken(connectionStore.connection, w, new PublicKey('2ZyXW3h7dyByYR6upHKGG9FntgGBJmj5PV3wRGUSooAV'))
    }
  }, { deep: true, immediate: true })

  watch(() => connectionStore.cluster, async () => {
    init().then()
  }, { immediate: true })

  async function init() {
    state.loading = true
    try {
      tokenSwap.value = await TokenSwap.loadTokenSwap(connectionStore.connection, POOL_ADDRESS)
      await loadPoolTokenAccounts()
    } catch (e) {
      console.log(e)
      tokenSwap.value = undefined
    } finally {
      state.loading = false
    }
    console.log('Token SWAP: ', tokenSwap.value)
  }

  async function loadPoolTokenAccounts() {
    if (!tokenSwap.value) {
      return
    }
    const accs = await getTokensByOwner(connectionStore.connection, tokenSwap.value.authority)
    for (const acc of accs) {
      const s = getSymbolByMint(acc.mint)
      if (s) {
        state.poolBalance[s] = acc.amount
      }
    }
    const poolMint = await getMint(connectionStore.connection, tokenSwap.value.poolToken)
    state.poolTokenSupply = Number(poolMint.supply)
    state.rate = getRate()
  }

  async function loadUserTokenAccounts() {
    if (!tokenSwap.value) {
      return
    }
    const _wallet = wallet.value?.publicKey
    if (!_wallet) {
      console.log('Wallet is not connected...')
      return
    }
    const accs = await getTokensByOwner(connectionStore.connection, _wallet, [
      tokenSwap.value.poolToken,
      tokenSwap.value.mintA,
      tokenSwap.value.mintB,
    ])

    const balances = { TOKEN_A: 0, TOKEN_B: 0, JPLU: 0 }
    for (const acc of accs) {
      const s = getSymbolByMint(acc.mint)
      if (s) {
        balances[s] = acc.amount
      }
    }
    state.userBalance = balances
    console.log(state.userBalance)
  }

  function getRate(): number {
    return lamportsToSol(depositSingleTokenType(LAMPORTS_PER_SOL))
  }

  function getSymbolByMint(mint: PublicKey): PoolTokenSymbol | undefined {
    if (!tokenSwap.value) {
      return
    }
    switch (String(mint)) {
      case String(tokenSwap.value.mintA): return PoolTokenSymbol.TOKEN_A
      case String(tokenSwap.value.mintB): return PoolTokenSymbol.TOKEN_B
      case String(tokenSwap.value.poolToken): return PoolTokenSymbol.JPLU
    }
  }

  /**
   * Get the amount of pool tokens for the deposited amount of token A or B.
   *
   * @see https://github.com/solana-labs/solana-program-library/blob/master/token-swap/program/src/curve/constant_product.rs#L112
   * @param {number} amountIn In lamports
   */
  function depositSingleTokenType(amountIn: string | number) {
    const swapSourceAmount = new Decimal(state.poolBalance.SOL ?? 0)
    const ratio = new Decimal(amountIn).div(swapSourceAmount)

    const one = new Decimal(1)
    const base = one.add(ratio)
    const root = base.sqrt().sub(one)
    const res = new Decimal(state.poolTokenSupply).mul(root)
    // TODO: check ceiling
    return res.toNumber()
  }

  /**
   * Get the amount of pool tokens for the withdrawn amount of token A or B.
   *
   * @param {number} amountIn In lamports
   */
  function withdrawSingleTokenTypeExactOut(amountIn: string | number) {
    const swapSourceAmount = new Decimal(state.poolBalance.SOL ?? 0)
    const ratio = new Decimal(amountIn).div(swapSourceAmount)
    const one = new Decimal(1)
    const base = one.sub(ratio)
    if (base.isNeg()) {
      return 0
    }
    const root = one.sub(base.sqrt())
    const res = new Decimal(state.poolTokenSupply).mul(root)
    // TODO: check ceiling
    return res.toNumber()
  }

  return {
    state,
    tokenSwap,
    depositSingleTokenType,
    withdrawSingleTokenTypeExactOut,
  }
})

export interface SwapData {
  value?: number | string
  image: string
  balance?: number
  label: string
  amount?: number
}
