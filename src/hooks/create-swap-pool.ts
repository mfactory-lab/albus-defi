import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { CurveType } from '@albus-finance/swap-sdk'
import type { DataV2 } from '@metaplex-foundation/mpl-token-metadata'
import { PROGRAM_ID, createCreateMetadataAccountV3Instruction, createUpdateMetadataAccountV2Instruction } from '@metaplex-foundation/mpl-token-metadata'
import { createSetAuthorityInstruction } from '@solana/spl-token'
import { getCreateMintTx, getOrInitAssociatedTokenAddress, sendTransaction } from '@/utils'
import { LP_DECIMALS, type PolicyItem, type TokenData } from '@/config'

export function useCreateSwap() {
  const swapStore = useSwapStore()
  const wallet = useAnchorWallet()
  const { publicKey } = useWallet()
  const connectionStore = useConnectionStore()
  const { monitorTransaction } = useMonitorTransaction()
  const { notify } = useQuasar()

  const state = reactive<CreateSwapState>({
    tokenA: undefined,
    tokenB: undefined,
    policy: undefined,
    hostFeeNumerator: 0,
    hostFeeDenominator: 1000,
    tradeFeeNumerator: 0,
    tradeFeeDenominator: 1000,
    ownerTradeFeeNumerator: 0,
    ownerTradeFeeDenominator: 1000,
    ownerWithdrawFeeNumerator: 0,
    ownerWithdrawFeeDenominator: 1000,
    creating: false,

    tokenSwap: undefined,
    poolMint: undefined,
    poolFeeAccount: undefined,
    swapTokenA: undefined,
    swapTokenB: undefined,
  })

  const metadataState = reactive<LPTMetadataState>({
    name: '',
    symbol: '',
    metadataUrl: '',
    isMutable: false,
  })

  async function generateSwapKeypair() {
    if (!publicKey.value || !wallet.value) {
      return
    }
    state.tokenSwap = Keypair.generate()
    console.log('[create swap] token swap pk = ', state.tokenSwap.publicKey.toBase58())
    console.log('[create swap] token swap sk = ', state.tokenSwap.secretKey.toString())
  }

  async function createPoolMint() {
    if (!publicKey.value || !wallet.value || !state.tokenSwap) {
      return
    }
    const swapAuthority = swapStore.swapClient.swapAuthority(state.tokenSwap.publicKey)
    const tx = new Transaction()

    state.creating = true
    try {
      const poolMint = await getCreateMintTx(connectionStore.connection, tx, publicKey.value, publicKey.value, LP_DECIMALS)

      const metadata = PublicKey.findProgramAddressSync(
        [
        // eslint-disable-next-line n/prefer-global/buffer
          Buffer.from('metadata'),
          PROGRAM_ID.toBuffer(),
          poolMint.publicKey.toBuffer(),
        ],
        PROGRAM_ID,
      )[0]

      const tokenMetadata = {
        name: metadataState.name,
        symbol: metadataState.symbol,
        uri: metadataState.metadataUrl,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      } as DataV2

      const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
        {
          metadata,
          mint: poolMint.publicKey,
          mintAuthority: publicKey.value,
          payer: publicKey.value,
          updateAuthority: publicKey.value,
        },
        {
          createMetadataAccountArgsV3: {
            data: tokenMetadata,
            isMutable: metadataState.isMutable,
            collectionDetails: null,
          },
        },
      )
      tx.add(createMetadataInstruction)

      const setAuthorityInstruction = createSetAuthorityInstruction(
        poolMint.publicKey,
        publicKey.value,
        0,
        swapAuthority,
      )
      tx.add(setAuthorityInstruction)

      const updateMetadataInstruction = createUpdateMetadataAccountV2Instruction(
        {
          metadata,
          updateAuthority: publicKey.value,
        },
        {
          updateMetadataAccountArgsV2: {
            data: tokenMetadata,
            updateAuthority: swapAuthority,
            primarySaleHappened: true,
            isMutable: true,
          },
        },
      )
      tx.add(updateMetadataInstruction)

      console.log('[create swap] poolMint = ', poolMint.publicKey.toBase58())
      if (tx.instructions.length > 0) {
        await monitorTransaction(
          sendTransaction(connectionStore.connection, wallet.value!, tx.instructions, [poolMint]),
          {
            onSuccess: () => {
              state.poolMint = poolMint.publicKey
              notify({
                type: 'positive',
                message: 'Pool mint created successfully.',
              })
            },
          },
        )
      }
    } catch (e) {
      console.error(e)
      notify({
        type: 'negative',
        message: `${e}`,
      })
    } finally {
      state.creating = false
    }
  }

  async function createPoolAccounts() {
    if (!publicKey.value || !wallet.value) {
      return notify({
        type: 'negative',
        message: 'Connect wallet',
      })
    }
    if (!state.tokenSwap) {
      return notify({
        type: 'negative',
        message: 'Define tokenSwap',
      })
    }
    if (!state.poolMint) {
      return notify({
        type: 'negative',
        message: 'Define pool mint',
      })
    }
    if (!state.tokenA || !state.tokenB) {
      return notify({
        type: 'negative',
        message: 'Select tokens',
      })
    }
    const swapAuthority = swapStore.swapClient.swapAuthority(state.tokenSwap.publicKey)
    const tx = new Transaction()

    state.creating = true
    try {
      const poolFeeAccount = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, state.poolMint, publicKey.value)
      const swapTokenA = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, new PublicKey(state.tokenA.mint), swapAuthority, publicKey.value, true)
      const swapTokenB = await getOrInitAssociatedTokenAddress(connectionStore.connection, tx, new PublicKey(state.tokenB.mint), swapAuthority, publicKey.value, true)
      console.log('[create swap] poolFeeAccount = ', poolFeeAccount.toBase58())
      console.log('[create swap] swapTokenA = ', swapTokenA.toBase58())
      console.log('[create swap] swapTokenB = ', swapTokenB.toBase58())
      if (tx.instructions.length > 0) {
        await monitorTransaction(
          sendTransaction(connectionStore.connection, wallet.value!, tx.instructions),
          {
            commitment: 'finalized',
            onSuccess: () => {
              state.poolFeeAccount = poolFeeAccount
              state.swapTokenA = swapTokenA
              state.swapTokenB = swapTokenB
              notify({
                type: 'positive',
                message: 'Pool accounts created successfully.',
              })
            },
          },
        )
      } else {
        state.poolFeeAccount = poolFeeAccount
        state.swapTokenA = swapTokenA
        state.swapTokenB = swapTokenB
      }
    } catch (e) {
      console.error(e)
      notify({
        type: 'negative',
        message: `${e}`,
      })
    } finally {
      state.creating = false
    }
    /**
     * transfer tokens to pool token accounts
     */
  }

  async function createTokenSwap() {
    if (
      !publicKey.value
      || !wallet.value
      || !state.tokenSwap
      || !state.poolMint
      || !state.poolFeeAccount
      || !state.swapTokenA
      || !state.swapTokenB
    ) {
      return
    }
    if (!state.tokenA || !state.tokenB) {
      return notify({
        type: 'negative',
        message: 'Select tokens',
      })
    }
    if (!state.policy) {
      return notify({
        type: 'negative',
        message: 'Select policy',
      })
    }
    console.log('createTokenSwap: ', {
      tokenSwap: state.tokenSwap.publicKey.toBase58(),
      poolMint: state.poolMint.toBase58(),
      poolFee: state.poolFeeAccount.toBase58(),
      destination: state.poolFeeAccount.toBase58(),
      tokenA: state.swapTokenA.toBase58(),
      tokenB: state.swapTokenB.toBase58(),
      policy: state.policy.pubkey.toBase58(),
      curveType: CurveType.ConstantProduct,
      curveParameters: [],
      fees: {
        tradeFeeNumerator: state.tradeFeeNumerator,
        tradeFeeDenominator: state.tradeFeeDenominator,
        ownerTradeFeeNumerator: state.ownerTradeFeeNumerator,
        ownerTradeFeeDenominator: state.ownerTradeFeeDenominator,
        ownerWithdrawFeeNumerator: state.ownerWithdrawFeeNumerator,
        ownerWithdrawFeeDenominator: state.ownerWithdrawFeeDenominator,
        hostFeeNumerator: state.hostFeeNumerator,
        hostFeeDenominator: state.hostFeeDenominator,
      },
    })

    state.creating = true
    try {
      const tokenSwapRes = await swapStore.swapClient.createTokenSwap({
        tokenSwap: state.tokenSwap,
        poolMint: state.poolMint,
        poolFee: state.poolFeeAccount,
        destination: state.poolFeeAccount,
        tokenA: state.swapTokenA,
        tokenB: state.swapTokenB,
        policy: state.policy.pubkey,
        curveType: CurveType.ConstantProduct,
        curveParameters: [],
        fees: {
          tradeFeeNumerator: state.tradeFeeNumerator,
          tradeFeeDenominator: state.tradeFeeDenominator,
          ownerTradeFeeNumerator: state.ownerTradeFeeNumerator,
          ownerTradeFeeDenominator: state.ownerTradeFeeDenominator,
          ownerWithdrawFeeNumerator: state.ownerWithdrawFeeNumerator,
          ownerWithdrawFeeDenominator: state.ownerWithdrawFeeDenominator,
          hostFeeNumerator: state.hostFeeNumerator,
          hostFeeDenominator: state.hostFeeDenominator,
        },
      })
      notify({
        type: 'positive',
        message: `Swap Pool created successfully. ${state.tokenSwap?.publicKey.toBase58()}`,
      })
      console.log('[create swap] tokenSwap result = ', tokenSwapRes)
    } catch (e) {
      console.error(e)
      notify({
        type: 'negative',
        message: `${e}`,
      })
    } finally {
      state.creating = false
    }
  }

  function reset() {
    state.hostFeeNumerator = 0
    state.hostFeeDenominator = 1000
    state.tradeFeeNumerator = 0
    state.tradeFeeDenominator = 1000
    state.ownerTradeFeeNumerator = 0
    state.ownerTradeFeeDenominator = 1000
    state.ownerWithdrawFeeNumerator = 0
    state.ownerWithdrawFeeDenominator = 1000
    state.policy = undefined
    state.tokenA = undefined
    state.tokenB = undefined

    metadataState.name = ''
    metadataState.symbol = ''
    metadataState.metadataUrl = ''
  }

  return {
    state,
    metadataState,
    reset,
    generateSwapKeypair,
    createPoolMint,
    createPoolAccounts,
    createTokenSwap,
  }
}

interface CreateSwapState {
  tokenA: TokenData | undefined
  tokenB: TokenData | undefined
  policy: PolicyItem | undefined
  hostFeeNumerator: number
  hostFeeDenominator: number
  tradeFeeNumerator: number
  tradeFeeDenominator: number
  ownerTradeFeeNumerator: number
  ownerTradeFeeDenominator: number
  ownerWithdrawFeeNumerator: number
  ownerWithdrawFeeDenominator: number
  creating: boolean

  tokenSwap: Keypair | undefined
  poolMint: PublicKey | undefined
  poolFeeAccount: PublicKey | undefined
  swapTokenA: PublicKey | undefined
  swapTokenB: PublicKey | undefined
}

interface LPTMetadataState {
  name: string
  symbol: string
  metadataUrl: string
  isMutable: boolean
}
