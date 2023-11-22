import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress, getMint } from '@solana/spl-token'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import type { TokenSwap } from '@albus-finance/swap-sdk'
import { AlbusSwapClient } from '@albus-finance/swap-sdk'
import { AnchorProvider } from '@coral-xyz/anchor'
import { divideBnToNumber, getTokensByOwner, lamportsToSol, showCreateDialog, solToLamports } from '@/utils'
import { POOL_ADDRESS, TOKEN_A, TOKEN_B } from '@/config'
import type { TokenData } from '@/config'

interface PoolFees {
  host: number
  trade: number
  ownerTrade: number
  ownerWithdraw: number
}

interface SwapState {
  loading: boolean
  poolTokenSupply: number
  poolBalance: { [key: string]: any }
  slippageDialog: boolean
  status?: number

  from: TokenData
  to: TokenData
  slippage: number
  rate: number
  impact: number
  swapping: boolean
  active: boolean
  fees: PoolFees
  direction: SwapDirection
}

interface SwapPool {
  pubkey: PublicKey
  data: TokenSwap | null
}

enum SwapDirection {
  ASC,
  DESC,
}

export const useSwapStore = defineStore('swap', () => {
  const connectionStore = useConnectionStore()
  const userStore = useUserStore()
  const wallet = useAnchorWallet()
  const { publicKey } = useWallet()
  const { notify } = useQuasar()

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

  const state = reactive<SwapState>({
    loading: false,
    slippageDialog: false,
    status: undefined,
    poolBalance: {},
    poolTokenSupply: 0,

    from: TOKEN_A,
    to: TOKEN_B,
    swapping: false,
    active: false,
    slippage: 0.01,
    rate: 0,
    impact: 0,
    fees: {
      host: 0,
      trade: 0,
      ownerTrade: 0,
      ownerWithdraw: 0,
    },
    direction: SwapDirection.ASC,
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

  /**
   * Get the amount of pool tokens for the deposited amount of token A or B.
   *
   * @see https://github.com/solana-labs/solana-program-library/blob/master/token-swap/program/src/curve/constant_product.rs#L112
   * @param {number} amountIn In lamports
   */
  const calcRate = async () => {
    const fromAmount = solToLamports(state.from.amount ?? 0, state.from.decimals)

    const poolFrom = Number(state.poolBalance[state.from.mint] ?? 0)
    const poolTo = Number(state.poolBalance[state.to.mint] ?? 0)

    if (fromAmount === 0 || Number.isNaN(fromAmount)) {
      state.to.amount = 0
      state.rate = poolTo / poolFrom
      state.impact = 0
      return
    }

    console.log(state.fees)
    const toAmount = poolTo - (poolFrom * poolTo / (poolFrom + fromAmount))
    state.rate = fromAmount ? toAmount / fromAmount : poolTo / poolFrom
    state.to.amount = lamportsToSol(toAmount ? toAmount * (1 - state.fees.ownerTrade - state.fees.trade) : 0, state.to.decimals)
    state.impact = fromAmount ? 1 - (toAmount / fromAmount) / (poolTo / poolFrom) : 0
  }

  watch(
    [
      () => state.from.amount,
      () => state.poolBalance,
    ],
    calcRate,
    { immediate: true },
  )

  const minimumReceived = computed(() => {
    const toAmount = Number(solToLamports(state.to.amount ?? 0, state.to.decimals))
    return Math.floor(toAmount - (toAmount * state.slippage))
  })

  async function swapSubmit() {
    if (!userStore.certificateValid) {
      return showCreateDialog()
    }

    if (!tokenSwap.value || !publicKey.value) {
      console.log('TokenSwap is not initialized...')
      return
    }

    const authority = wallet.value!.publicKey

    if (!authority) {
      notify({ type: 'info', message: 'Please connect your wallet first' })
    }

    const fromAmount = Number(solToLamports(state.from.amount ?? 0, state.from.decimals))
    const fromBalance = Number(solToLamports(userStore.tokenBalance(state.from.mint) ?? 0, state.from.decimals))
    const toAmount = Number(solToLamports(state.to.amount ?? 0, state.to.decimals))

    if (fromAmount > fromBalance) {
      notify({ type: 'negative', message: 'Insufficient balance.' })
      return
    }

    try {
      state.swapping = true

      const userSourceMint = state.direction === SwapDirection.ASC ? tokenSwap.value.tokenAMint : tokenSwap.value.tokenBMint
      const userDestinationMint = state.direction === SwapDirection.ASC ? tokenSwap.value.tokenBMint : tokenSwap.value.tokenAMint
      const poolSourceAddress = state.direction === SwapDirection.ASC ? tokenSwap.value.tokenA : tokenSwap.value.tokenB
      const poolDestinationAddress = state.direction === SwapDirection.ASC ? tokenSwap.value.tokenB : tokenSwap.value.tokenA

      const userSource = await getAssociatedTokenAddress(userSourceMint, wallet.value!.publicKey)
      const userDestination = await getAssociatedTokenAddress(userDestinationMint, wallet.value!.publicKey)
      const sourceTokenAmount = fromAmount

      console.log('toAmount = ', toAmount)
      console.log('slippage = ', state.slippage)
      console.log('slippage 2 = ', toAmount * state.slippage)

      const authority = swapClient.value.swapAuthority(POOL_ADDRESS)

      console.log('proofRequest = ', userStore.certificate?.pubkey.toBase58())
      console.log('swapAuthority = ', authority)
      console.log('tokenSwap = ', POOL_ADDRESS.toBase58())
      console.log('userSource = ', userSource.toBase58())
      console.log('userDestination = ', userDestination.toBase58())
      console.log('poolSource = ', poolSourceAddress.toBase58())
      console.log('poolDestination = ', poolDestinationAddress.toBase58())
      console.log('poolMint = ', tokenSwap.value.poolMint.toBase58())
      console.log('poolFee = ', tokenSwap.value.poolFeeAccount.toBase58())
      console.log('amountIn = ', sourceTokenAmount)
      console.log('minimumAmountOut = ', minimumReceived.value)
      await swapClient.value.swap({
        proofRequest: userStore.certificate?.pubkey,
        authority,
        tokenSwap: POOL_ADDRESS,
        userSource,
        userDestination,
        poolSource: poolSourceAddress,
        poolDestination: poolDestinationAddress,
        poolMint: tokenSwap.value.poolMint,
        poolFee: tokenSwap.value.poolFeeAccount,
        amountIn: sourceTokenAmount,
        minimumAmountOut: minimumReceived.value,
        // hostFeeAccount: undefined,
        receiver: publicKey.value,
        destinationTokenMint: userDestinationMint,
      }, { commitment: 'confirmed' })
      reload()
    } catch (e) {
      console.log(e)
    } finally {
      state.swapping = false
    }
  }

  function changeDirection() {
    const { from, to } = state
    state.rate = 0
    state.to = { ...from, amount: undefined }
    state.from = { ...to, amount: undefined }
    state.direction = state.direction === SwapDirection.ASC ? SwapDirection.DESC : SwapDirection.ASC
  }

  function openSlippage() {
    state.slippageDialog = true
  }

  function closeSlippage() {
    state.slippageDialog = false
  }

  function setMax(amount: number) {
    state.from.amount = amount
  }

  function reload() {
    loadPoolTokenAccounts()
    state.from.amount = undefined
    state.to.amount = undefined
  }

  watch(() => wallet.value?.publicKey, (p) => {
    if (!p) {
      reload()
    }
  })

  watch(() => state.to, (s) => {
    if (s.amount) {
      s.amount = undefined
    }
  })

  watch(tokenSwap, (ts) => {
    if (!ts) {
      return
    }
    state.fees.host = divideBnToNumber(
      // @ts-expect-error is BN
      ts.fees.hostFeeNumerator,
      ts.fees.hostFeeDenominator,
    )
    state.fees.ownerTrade = divideBnToNumber(
      // @ts-expect-error is BN
      ts.fees.ownerTradeFeeNumerator,
      ts.fees.ownerTradeFeeDenominator,
    )
    state.fees.ownerWithdraw = divideBnToNumber(
      // @ts-expect-error i BN
      ts.fees.ownerWithdrawFeeNumerator,
      ts.fees.ownerWithdrawFeeDenominator,
    )
    state.fees.trade = divideBnToNumber(
      // @ts-expect-error is BN
      ts.fees.tradeFeeNumerator,
      ts.fees.tradeFeeDenominator,
    )
  })

  return {
    state,
    tokenSwap,
    swapClient,
    loadPoolTokenAccounts,
    minimumReceived,
    setMax,
    closeSlippage,
    openSlippage,
    changeDirection,
    swapSubmit,
  }
})
