import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { CurveType } from '@albus-finance/swap-sdk'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import { sendTransaction } from '@/utils'

export function useCreateSwap() {
  const swapStore = useSwapStore()
  const wallet = useAnchorWallet()
  const { publicKey } = useWallet()
  const connectionStore = useConnectionStore()
  const { monitorTransaction } = useMonitorTransaction()
  const { notify } = useQuasar()

  const userStore = useUserStore()
  const requiredPolicy = computed(() => userStore.requiredPolicy)

  const state = reactive<CreateSwapState>({
    tokenA: '7pzAmiDUmASVTCLpLA2Q8bfDZDiiNCwiPsAkLnAQVFhX',
    tokenB: 'CvWaX7hRctkaTDwM1oviAW3zau6iWD4XHmhNzdtBsm4E',
    policy: 'CjnpmL6Svfr3Vhpp1jVWCcNbJRxbyPY5ZQF8QiNXWXtT',
    hostFee: 1,
    tradeFee: 0,
    ownerTradeFee: 0,
    ownerWithdrawFee: 0,
    creating: false,
  })

  async function createTokenSwap() {
    if (!publicKey.value || !state.tokenA || !state.tokenB) {
      return
    }
    // const tokenA = new PublicKey(state.tokenA)
    // const tokenB = new PublicKey(state.tokenB)
    const tokenSwap = Keypair.generate()
    console.log('[create swap] token swap pk = ', tokenSwap.publicKey.toBase58())
    console.log('[create swap] token swap sk = ', tokenSwap.secretKey.toString())
    const swapAuthority = swapStore.swapClient.swapAuthority(tokenSwap.publicKey)

    const payer = Keypair.fromSecretKey(bs58.decode('2KzxAXRpeEK6an3Hp9inJGARxDYcsCAMR1bVHYwB7xbcM1CbRsYFRfAfZTQ4hJ4819WRxdnT9exLKRCyRKrQs4Gu'))
    const tokenA = await createMint(connectionStore.connection, payer, payer.publicKey, null, 9)
    console.log('[create swap] tokenA = ', tokenA.toBase58())
    const tokenB = await createMint(connectionStore.connection, payer, payer.publicKey, null, 9)
    const poolMint = await createMint(connectionStore.connection, payer, swapAuthority, null, 9)
    let tx = new Transaction()
    // const poolMint = await getCreateMintTx(connectionStore.connection, tx, publicKey.value, swapAuthority, 9)
    console.log('[create swap] poolMint = ', poolMint.toBase58())
    console.log('[create swap] tx = ', tx)
    if (tx.instructions.length > 0) {
      await monitorTransaction(
        sendTransaction(connectionStore.connection, wallet.value!, tx.instructions),
        {
          onSuccess: () => notify({
            type: 'positive',
            message: `Pool created successfully. ${tokenSwap.publicKey.toBase58()}`,
          }),
        },
      )
    }

    const poolFeeAccount = await getOrCreateAssociatedTokenAccount(connectionStore.connection, payer, poolMint, payer.publicKey)
    const swapTokenA = await getOrCreateAssociatedTokenAccount(connectionStore.connection, payer, tokenA, swapAuthority, true)
    const swapTokenB = await getOrCreateAssociatedTokenAccount(connectionStore.connection, payer, tokenB, swapAuthority, true)
    // create associated token accounts
    tx = new Transaction()
    // const poolFeeAccount = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, poolMint, publicKey.value)
    // const swapTokenA = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, tokenA, swapAuthority, publicKey.value, true)
    // const swapTokenB = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, tokenB, swapAuthority, publicKey.value, true)
    console.log('[create swap] poolFeeAccount = ', poolFeeAccount)
    console.log('[create swap] swapTokenA = ', swapTokenA)
    console.log('[create swap] swapTokenB = ', swapTokenB)

    // console.log('[create swap] poolFeeAccount = ', poolFeeAccount.toBase58())
    // console.log('[create swap] swapTokenA = ', swapTokenA.toBase58())
    // console.log('[create swap] swapTokenB = ', swapTokenB.toBase58())
    if (tx.instructions.length > 0) {
      await monitorTransaction(
        sendTransaction(connectionStore.connection, wallet.value!, tx.instructions),
        {
          commitment: 'finalized',
          onSuccess: () => notify({
            type: 'positive',
            message: `Pool created successfully. ${tokenSwap.publicKey.toBase58()}`,
          }),
        },
      )
    }
    await mintTo(connectionStore.connection, payer, tokenA, swapTokenA.address, payer, 100_000_000_000)
    await mintTo(connectionStore.connection, payer, tokenB, swapTokenB.address, payer, 100_000_000_000)

    const tokenSwapRes = await swapStore.swapClient.createTokenSwap({
      tokenSwap,
      poolMint,
      poolFee: poolFeeAccount.address,
      destination: poolFeeAccount.address,
      tokenA,
      tokenB,
      policy: new PublicKey(requiredPolicy.value),
      curveType: CurveType.ConstantProduct,
      curveParameters: [],
      fees: {
        tradeFeeNumerator: state.tradeFee,
        tradeFeeDenominator: 1000,
        ownerTradeFeeNumerator: state.ownerTradeFee,
        ownerTradeFeeDenominator: 1000,
        ownerWithdrawFeeNumerator: state.ownerWithdrawFee,
        ownerWithdrawFeeDenominator: 1000,
        hostFeeNumerator: state.hostFee,
        hostFeeDenominator: 1000,
      },
    })
    console.log('[create swap] tokenSwap result = ', tokenSwapRes)
  }

  function reset() {
    state.hostFee = 0
    state.tradeFee = 0
    state.ownerTradeFee = 0
    state.ownerWithdrawFee = 0
    state.policy = ''
    state.tokenA = ''
    state.tokenB = ''
  }

  return {
    state,
    reset,
    createTokenSwap,
  }
}

interface CreateSwapState {
  tokenA: string
  tokenB: string
  policy: string
  hostFee: number
  tradeFee: number
  ownerTradeFee: number
  ownerWithdrawFee: number
  creating: boolean
}
