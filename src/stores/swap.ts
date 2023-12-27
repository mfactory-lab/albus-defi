import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import debounce from 'lodash-es/debounce'
import { getAccount, getAssociatedTokenAddress, getMint } from '@solana/spl-token'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import type { TokenSwap } from '@albus-finance/swap-sdk'
import { AlbusSwapClient } from '@albus-finance/swap-sdk'
import { AnchorProvider } from '@coral-xyz/anchor'
import { divideBnToNumber, formatBalance, getTokensByOwner, lamportsToSol, showCreateDialog, solToLamports } from '@/utils'
import { SOL_MINT, WRAPPED_SOL_TOKEN } from '@/config'
import type { TokenData } from '@/config'

export interface PoolFees {
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

  from: TokenData
  to: TokenData
  slippage: number
  rate: number
  minimumReceived: number
  impact: number
  swapping: boolean
  active: boolean
  fees: PoolFees
  direction: SwapDirection
}

export interface SwapPool {
  pubkey: PublicKey
  data: TokenSwap
}

export enum SwapDirection {
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

  const userPoolsTokens = ref<Record<string, number>>({})

  const tokenSwapsAll = ref<SwapPool[]>([])
  const tokenSwapsAllFiltered = ref<SwapPool[]>([])
  const tokenSwaps = ref<SwapPool[]>([])
  const tokenSwap = ref<SwapPool | undefined>()

  const tokenAMint = useLocalStorage<string>('token-a', '')
  const tokenBMint = useLocalStorage<string>('token-b', '')
  const state = reactive<SwapState>({
    loading: false,
    slippageDialog: false,
    poolBalance: {},
    poolTokenSupply: 0,

    from: WRAPPED_SOL_TOKEN,
    to: WRAPPED_SOL_TOKEN,
    swapping: false,
    active: false,
    slippage: 0.01,
    rate: 0,
    minimumReceived: 0,
    impact: 0,
    fees: {
      host: 0,
      trade: 0,
      ownerTrade: 0,
      ownerWithdraw: 0,
    },
    direction: SwapDirection.ASC,
  })

  const { handleFilterToken, tokens } = useToken()
  handleFilterToken(SOL_MINT)
  watch(tokens, () => {
    if (tokens.value.length >= 2) {
      state.from = tokens.value.find(t => t.mint === tokenAMint.value) ?? tokens.value[0]
      state.to = tokens.value.find(t => t.mint === tokenBMint.value) ?? tokens.value[1]
    }
  }, { immediate: true })

  watch(() => state.from, () => {
    if (state.from) {
      tokenAMint.value = state.from.mint
    }
  })
  watch(() => state.to, () => {
    if (state.to) {
      tokenBMint.value = state.to.mint
    }
  })

  watch([wallet, () => connectionStore.cluster], async (w) => {
    init().then()
    if (!w) {
      resetStore()
    }
  }, { immediate: true })

  watch([publicKey, tokenSwapsAllFiltered], debounce(async () => {
    if (publicKey.value && tokenSwapsAllFiltered.value.length > 0) {
      const userTokens: Record<string, number> = {}
      for (const pool of tokenSwapsAllFiltered.value) {
        try {
          const userAddr = await getAssociatedTokenAddress(pool.data.poolMint, publicKey.value)
          const userAcc = await getAccount(connectionStore.connection, userAddr)
          userTokens[pool.data.poolMint.toBase58()] = Number(userAcc.amount)
          console.log('userAcc === ', userAcc)
        } catch {}
      }
      userPoolsTokens.value = userTokens
    }
  }, 500), { immediate: true })

  async function init() {
    state.loading = true
    try {
      console.log('swapClient ================: ', swapClient.value)
      tokenSwapsAll.value = await swapClient.value.loadAll()
      console.log('swaps ================: ', tokenSwapsAll.value)
    } catch (e) {
      console.log(e)
      tokenSwapsAll.value = []
    } finally {
      state.loading = false
    }
  }

  const loadingPoolTokens = ref(false)
  const loadPoolTokenAccounts = debounce(async () => {
    console.log('loadPoolTokenAccounts ========= ')
    if (!tokenSwap.value) {
      return
    }
    loadingPoolTokens.value = true
    try {
      const accs = await getTokensByOwner(connectionStore.connection, swapClient.value.swapAuthority(tokenSwap.value.pubkey))
      const poolBalance: { [key: string]: any } = {}
      for (const acc of accs) {
        poolBalance[`${acc.mint}`] = acc.amount
      }
      state.poolBalance = poolBalance
      const poolMint = await getMint(connectionStore.connection, tokenSwap.value.data.poolMint)
      state.poolTokenSupply = Number(poolMint.supply)
      console.log('[Pool Balance] poolMint', poolMint)
      console.log('[Pool Balance]', state.poolBalance)
      console.log('[Pool Balance] poolTokenSupply', state.poolTokenSupply)
    } catch (e) {
      console.log('[Pool Balance] error', e)
    } finally {
      loadingPoolTokens.value = false
    }
  }, 500)

  setInterval(loadPoolTokenAccounts, 60000)

  function setTokenSwap(swap: SwapPool) {
    tokenSwap.value = swap
    console.log('setTokenSwap: ', tokenSwap.value)
  }

  watch([
    tokenSwapsAll,
    () => userStore.servicePolicy,
  ], async () => {
    console.log('tokenSwapsAll: ', tokenSwapsAll.value)
    tokenSwapsAllFiltered.value = tokenSwapsAll.value.filter(p => !!userStore.servicePolicy.find(sp => sp.pubkey.toBase58() === p.data.policy?.toBase58()))
  }, { immediate: true })

  watch([
    tokenSwapsAllFiltered,
    () => state.from?.mint,
    () => state.to?.mint,
    () => userStore.servicePolicy,
  ], async () => {
    console.log('tokenSwapsAllFiltered: ', tokenSwapsAllFiltered.value)
    if (tokenSwapsAllFiltered.value && state.from?.mint && state.to?.mint && state.from.mint !== state.to.mint && userStore.servicePolicy.length) {
      tokenSwaps.value = tokenSwapsAllFiltered.value.filter((p) => {
        const tokenA = p.data?.tokenAMint.toBase58()
        const tokenB = p.data?.tokenBMint.toBase58()
        return (tokenA === state.from.mint && tokenB === state.to.mint) || (tokenA === state.to.mint && tokenB === state.from.mint)
      })
      if (tokenSwaps.value.length) {
        if (tokenSwaps.value.length > 1) {
          /**
           * find if there is a pool for which the user already has a certificate
           */
          const userHasPolicy = tokenSwaps.value.find(pool => userStore.state.certificates?.find(cert => cert.data?.policy.toBase58() === pool.data.policy?.toBase58()))
          if (userHasPolicy) {
            tokenSwap.value = userHasPolicy
          }
        }
        tokenSwap.value = tokenSwaps.value[0]
      } else {
        tokenSwap.value = undefined
      }
    } else {
      tokenSwaps.value = []
      tokenSwap.value = undefined
      userStore.setContractPolicy('', 'swap')
      state.poolBalance = {}
    }
  }, { immediate: true })

  watch([
    tokenSwap,
  ], async () => {
    console.log('Token SWAP: ', tokenSwap.value)
    userStore.setContractPolicy(tokenSwap.value?.data.policy?.toBase58() ?? '', 'swap')
    if (tokenSwap.value) {
      loadPoolTokenAccounts()
      if (tokenSwap.value.data.tokenAMint.toBase58() === state.from.mint) {
        state.direction = SwapDirection.ASC
      } else {
        state.direction = SwapDirection.DESC
      }
    }
  }, { immediate: true })

  function resetStore() {
    state.loading = false
    state.slippageDialog = false
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
    const fromAmount = Number(state.from.amount ?? 0)

    const poolFrom = lamportsToSol(Number(state.poolBalance[state.from.mint] ?? 0), state.from.decimals)
    const poolTo = lamportsToSol(Number(state.poolBalance[state.to.mint] ?? 0), state.to.decimals)

    if (fromAmount === 0 || Number.isNaN(fromAmount)) {
      state.to.amount = 0
      state.rate = Number(poolTo) / Number(poolFrom)
      state.impact = 0
      state.minimumReceived = 0
      return
    }

    const toAmount = poolTo - (poolFrom * poolTo / (poolFrom + fromAmount))
    state.rate = fromAmount ? toAmount / fromAmount : poolTo / poolFrom
    state.to.amount = toAmount ? Number(formatBalance(toAmount * (1 - state.fees.ownerTrade - state.fees.trade), state.to.decimals)) : 0
    state.impact = fromAmount ? 1 - (toAmount / fromAmount) / (poolTo / poolFrom) : 0
    state.minimumReceived = solToLamports(state.to.amount - (state.to.amount * state.slippage), state.to.decimals)
  }

  watch(
    [
      () => state.direction,
      () => state.from.amount,
      () => state.poolBalance,
    ],
    calcRate,
    { immediate: true },
  )

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

      const userSourceMint = state.direction === SwapDirection.ASC ? tokenSwap.value.data.tokenAMint : tokenSwap.value.data.tokenBMint
      const userDestinationMint = state.direction === SwapDirection.ASC ? tokenSwap.value.data.tokenBMint : tokenSwap.value.data.tokenAMint
      const poolSourceAddress = state.direction === SwapDirection.ASC ? tokenSwap.value.data.tokenA : tokenSwap.value.data.tokenB
      const poolDestinationAddress = state.direction === SwapDirection.ASC ? tokenSwap.value.data.tokenB : tokenSwap.value.data.tokenA
      console.log('userSourceMint = ', userSourceMint.toBase58())
      console.log('userDestinationMint = ', userDestinationMint.toBase58())

      console.log('userSourceMint = ', userSourceMint.toBase58())
      console.log('userDestinationMint = ', userDestinationMint.toBase58())

      const userSource = await getAssociatedTokenAddress(userSourceMint, wallet.value!.publicKey)
      const userDestination = await getAssociatedTokenAddress(userDestinationMint, wallet.value!.publicKey)
      const sourceTokenAmount = fromAmount

      console.log('toAmount = ', toAmount)
      console.log('slippage = ', state.slippage)
      console.log('slippage 2 = ', toAmount * state.slippage)

      const authority = swapClient.value.swapAuthority(tokenSwap.value.pubkey)

      console.log('proofRequest = ', userStore.certificate?.pubkey.toBase58())
      console.log('swapAuthority = ', authority)
      console.log('tokenSwap = ', tokenSwap.value.pubkey.toBase58())
      console.log('userSource = ', userSource.toBase58())
      console.log('userDestination = ', userDestination.toBase58())
      console.log('poolSource = ', poolSourceAddress.toBase58())
      console.log('poolDestination = ', poolDestinationAddress.toBase58())
      console.log('poolMint = ', tokenSwap.value.data.poolMint.toBase58())
      console.log('poolFee = ', tokenSwap.value.data.poolFeeAccount.toBase58())
      console.log('amountIn = ', sourceTokenAmount)
      console.log('minimumAmountOut = ', state.minimumReceived)

      const signature = await swapClient.value.swap({
        proofRequest: userStore.certificate?.pubkey,
        authority,
        tokenSwap: tokenSwap.value.pubkey,
        userSource,
        userDestination,
        poolSource: poolSourceAddress,
        poolDestination: poolDestinationAddress,
        poolMint: tokenSwap.value.data.poolMint,
        poolFee: tokenSwap.value.data.poolFeeAccount,
        amountIn: sourceTokenAmount,
        minimumAmountOut: state.minimumReceived,
        // hostFeeAccount: undefined,
        sourceTokenMint: userSourceMint,
        destinationTokenMint: userDestinationMint,
      }, { commitment: 'confirmed' })

      // showTransactionResultDialog(`https://explorer.solana.com/tx/${signature}?cluster=${connectionStore.cluster}`)
      notify({
        message: 'Transaction confirmed',
        type: 'positive',
        actions: [{
          label: 'Explore',
          color: 'white',
          target: '_blank',
          href: `https://explorer.solana.com/tx/${signature}?cluster=${connectionStore.cluster}`,
          onClick: () => false,
        }],
      })

      reload()
    } catch (e) {
      console.log(e)
      if (!`${e}`.includes('User rejected the request')) {
        notify({
          type: 'negative',
          message: `${e}`,
        })
      }
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

  function getPoolFee(tokenSwap: TokenSwap) {
    return {
      host: divideBnToNumber(
        tokenSwap.fees.hostFeeNumerator,
        tokenSwap.fees.hostFeeDenominator,
      ),
      trade: divideBnToNumber(
        tokenSwap.fees.tradeFeeNumerator,
        tokenSwap.fees.tradeFeeDenominator,
      ),
      ownerTrade: divideBnToNumber(
        tokenSwap.fees.ownerTradeFeeNumerator,
        tokenSwap.fees.ownerTradeFeeDenominator,
      ),
      ownerWithdraw: divideBnToNumber(
        tokenSwap.fees.ownerWithdrawFeeNumerator,
        tokenSwap.fees.ownerWithdrawFeeDenominator,
      ),
    }
  }

  watch(tokenSwap, (ts) => {
    if (!ts) {
      return
    }
    const fees = getPoolFee(ts.data)
    state.fees.host = fees.host
    state.fees.trade = fees.trade
    state.fees.ownerTrade = fees.ownerTrade
    state.fees.ownerWithdraw = fees.ownerWithdraw
    console.log('fees ==== ', state.fees)
  })

  return {
    state,
    tokenSwapsAllFiltered,
    tokenSwaps,
    tokenSwap,
    swapClient,
    loadingPoolTokens,
    loadPoolTokenAccounts,
    setTokenSwap,
    setMax,
    closeSlippage,
    openSlippage,
    changeDirection,
    swapSubmit,
    getPoolFee,
    // TODO: rework liquidity
    tokenAMint,
    tokenBMint,
    userPoolsTokens,
  }
})
