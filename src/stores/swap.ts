import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import { getMint } from '@solana/spl-token'
import { useAnchorWallet } from 'solana-wallets-vue'
import type { TokenSwap } from '@albus-finance/swap-sdk'
import { AlbusSwapClient } from '@albus-finance/swap-sdk'
import { AnchorProvider } from '@coral-xyz/anchor'
import { getTokensByOwner } from '@/utils'
import { POOL_ADDRESS } from '@/config'

export enum PoolTokenSymbol {
  TOKEN_A = 'TOKEN_A',
  TOKEN_B = 'TOKEN_B',
}

interface SwapStoreState {
  loading: boolean
  poolTokenSupply: number
  poolBalance: { [key: string]: any }
  userBalance: { [key: string]: any }
  slippageDialog: boolean
  status?: number
}

export const useSwapStore = defineStore('swap', () => {
  const connectionStore = useConnectionStore()
  const wallet = useAnchorWallet()

  const swapClient = computed(() => {
    return new AlbusSwapClient(
      new AnchorProvider(
        connectionStore.connection,
        wallet.value ?? { publicKey: PublicKey.default } as never,
        AnchorProvider.defaultOptions(),
      ),
    )
  })

  const tokenSwap = ref<TokenSwap | undefined>()

  const state = reactive<SwapStoreState>({
    loading: false,
    slippageDialog: false,
    status: undefined,
    poolBalance: { TOKEN_A: undefined, TOKEN_B: undefined },
    userBalance: { TOKEN_A: undefined, TOKEN_B: undefined },
    poolTokenSupply: 0,
  })

  watch(wallet, async (w) => {
    if (w) {
      init().then()
    } else {
      resetStore()
    }
  }, { immediate: true })

  watch(tokenSwap, async (t) => {
    if (t) {
      await loadUserTokenAccounts()
    }
  })

  async function init() {
    state.loading = true
    try {
      tokenSwap.value = await swapClient.value.load(POOL_ADDRESS)
      console.log('Token SWAP: ', tokenSwap.value)
      await loadPoolTokenAccounts()
      const swaps = await swapClient.value.loadAll()
      console.log('swaps ================: ', swaps)
    } catch (e) {
      console.log(e)
      tokenSwap.value = undefined
    } finally {
      state.loading = false
    }
  }

  async function loadPoolTokenAccounts() {
    console.log('loadPoolTokenAccounts ========= ')
    if (!tokenSwap.value) {
      return
    }
    const accs = await getTokensByOwner(connectionStore.connection, swapClient.value.swapAuthority(POOL_ADDRESS))
    for (const acc of accs) {
      const s = getSymbolByMint(acc.mint)
      if (s) {
        state.poolBalance[s] = acc.amount
      }
    }
    const poolMint = await getMint(connectionStore.connection, tokenSwap.value.poolMint)
    state.poolTokenSupply = Number(poolMint.supply)
    console.log('[Pool Balance]', state.poolBalance)
  }

  async function loadUserTokenAccounts() {
    console.log('loadUserTokenAccounts ========= ')
    if (!tokenSwap.value) {
      return
    }
    const _wallet = wallet.value?.publicKey
    if (!_wallet) {
      console.log('Wallet is not connected...')
      return
    }
    const accs = await getTokensByOwner(connectionStore.connection, _wallet, [
      // tokenSwap.value.poolToken,
      tokenSwap.value.tokenAMint,
      tokenSwap.value.tokenBMint,
    ])

    const balances = { TOKEN_A: 0, TOKEN_B: 0 }
    for (const acc of accs) {
      const s = getSymbolByMint(acc.mint)
      if (s) {
        balances[s] = +acc.amount
      }
    }
    state.userBalance = balances
    console.log('[User Balance]', state.userBalance)
  }

  function getSymbolByMint(mint: PublicKey): PoolTokenSymbol | undefined {
    if (!tokenSwap.value) {
      return
    }
    switch (String(mint)) {
      case String(tokenSwap.value.tokenAMint): return PoolTokenSymbol.TOKEN_A
      case String(tokenSwap.value.tokenBMint): return PoolTokenSymbol.TOKEN_B
    }
  }

  function resetStore() {
    state.loading = false
    state.slippageDialog = false
    state.status = undefined
    state.poolBalance = { TOKEN_A: undefined, TOKEN_B: undefined }
    state.userBalance = { TOKEN_A: undefined, TOKEN_B: undefined }
    state.poolTokenSupply = 0
  }

  return {
    state,
    tokenSwap,
    loadUserTokenAccounts,
    loadPoolTokenAccounts,
    swapClient,
  }
})

export interface SwapData {
  name: string
  symbol: string
  value?: number | string
  image: string
  balance?: number
  label: string
  amount?: number
  mint?: string
}
