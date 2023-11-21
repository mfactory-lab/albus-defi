import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import { getMint } from '@solana/spl-token'
import { useAnchorWallet } from 'solana-wallets-vue'
import type { TokenSwap } from '@albus-finance/swap-sdk'
import { AlbusSwapClient } from '@albus-finance/swap-sdk'
import { AnchorProvider } from '@coral-xyz/anchor'
import { getTokensByOwner } from '@/utils'
import { POOL_ADDRESS } from '@/config'

interface SwapStoreState {
  loading: boolean
  poolTokenSupply: number
  poolBalance: { [key: string]: any }
  slippageDialog: boolean
  status?: number
}

interface SwapPool {
  pubkey: PublicKey
  data: TokenSwap | null
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

  const tokenSwaps = ref<SwapPool[]>([])
  const tokenSwap = ref<TokenSwap | undefined>()

  const state = reactive<SwapStoreState>({
    loading: false,
    slippageDialog: false,
    status: undefined,
    poolBalance: {},
    poolTokenSupply: 0,
  })

  watch(wallet, async (w) => {
    if (w) {
      init().then()
    } else {
      resetStore()
    }
  }, { immediate: true })

  async function init() {
    state.loading = true
    try {
      tokenSwaps.value = await swapClient.value.loadAll()
      console.log('swaps ================: ', tokenSwaps.value)
    } catch (e) {
      console.log(e)
      tokenSwaps.value = []
    } finally {
      state.loading = false
    }
  }

  watch([tokenSwaps], async () => {
    tokenSwap.value = await swapClient.value.load(POOL_ADDRESS)
    console.log('Token SWAP: ', tokenSwap.value)
    await loadPoolTokenAccounts()
  })

  async function loadPoolTokenAccounts() {
    console.log('loadPoolTokenAccounts ========= ')
    if (!tokenSwap.value) {
      return
    }
    const accs = await getTokensByOwner(connectionStore.connection, swapClient.value.swapAuthority(POOL_ADDRESS))
    for (const acc of accs) {
      state.poolBalance[`${acc.mint}`] = acc.amount
    }
    const poolMint = await getMint(connectionStore.connection, tokenSwap.value.poolMint)
    state.poolTokenSupply = Number(poolMint.supply)
    console.log('[Pool Balance]', state.poolBalance)
    console.log('[Pool Balance] poolTokenSupply', state.poolTokenSupply)
  }

  function resetStore() {
    state.loading = false
    state.slippageDialog = false
    state.status = undefined
    state.poolBalance = {}
    state.poolTokenSupply = 0
  }

  return {
    state,
    tokenSwap,
    loadPoolTokenAccounts,
    swapClient,
  }
})
