import { defineStore } from 'pinia'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { AnchorProvider } from '@coral-xyz/anchor'
import { AlbusTransferClient } from '@albus-finance/transfer-sdk'
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token'
import BN from 'bn.js'
import type { SwapData } from './swap'
import type { IProofRequestStatus } from '@/stores'
import { createTransaction, startCreateCertificate, transactionFee, validateAddress } from '@/utils'
import { MIN_TRANSFER_FEE, TRANSFER_FEE_CONST } from '@/config'

export const useTransferStore = defineStore('transfer', () => {
  const connectionStore = useConnectionStore()
  const { tokens } = useTokenStore()
  const userStore = useUserStore()
  const { state: tokenState, getUserTokens } = useUserStore()
  const certificate = computed(() => userStore.certificate)
  const requiredPolicy = computed(() => userStore.requiredPolicy)
  const certificateValid = computed(() => userStore.certificateValid)
  const defaultFee = 0.00

  const wallet = useAnchorWallet()
  const { publicKey } = useWallet()
  const { notify } = useQuasar()

  const token = reactive<SwapData>(tokens[0])

  const state = reactive<TransferState>({
    address: '',
    value: undefined,
    loading: false,
    token,
    fee: defaultFee,
    valid: false,
  })

  function reset() {
    state.value = undefined
    state.fee = defaultFee
  }

  watch(() => state.token, () => {
    reset()
    userStore.policySpec = state.token.name
  })

  watch(() => wallet.value?.publicKey, (p) => {
    if (!p) {
      reset()
      state.address = ''
    }
  })

  watch(() => state.address, async () => {
    state.valid = validateAddress(state.address)
  })

  const tokenMint = computed(() => {
    const mint = state.token.mint ?? ''
    return validateAddress(mint) ? new PublicKey(mint) : ''
  })
  const receiver = computed(() => validateAddress(state.address) ? new PublicKey(state.address) : '')
  const destinationTokenAcc = ref()
  const hasTokenAccount = ref(false)
  watch([tokenMint, receiver, () => state.valid], async () => {
    if (state.token.label === 'sol') {
      return hasTokenAccount.value = true
    }
    if (tokenMint.value && receiver.value && state.valid) {
      try {
        destinationTokenAcc.value = await getAssociatedTokenAddress(tokenMint.value, receiver.value)
        await getAccount(connectionStore.connection, destinationTokenAcc.value)
        return hasTokenAccount.value = true
      } catch (e) {
        hasTokenAccount.value = false
      }
    }
    hasTokenAccount.value = false
  })
  watch([() => state.valid, () => state.value, destinationTokenAcc], () => {
    if (state.valid && Number(state.value) > 0) {
      getTransactionFee()
    } else {
      state.fee = defaultFee
    }
  })

  const transferClient = computed(() => {
    return new AlbusTransferClient(
      new AnchorProvider(
        connectionStore.connection,
        wallet.value ?? { publicKey: PublicKey.default } as never,
        AnchorProvider.defaultOptions(),
      ),
    )
  })

  async function getTransactionFee() {
    const transaction = await createTransaction(
      wallet.value?.publicKey as PublicKey, state.address, Number(state.value), connectionStore.connection)

    const fee = await transactionFee(transaction, connectionStore.connection) + TRANSFER_FEE_CONST
    return state.fee = !hasTokenAccount.value ? fee + MIN_TRANSFER_FEE : fee
    // TODO: fee from sdk
    const policy = new PublicKey(requiredPolicy.value)
    if (!publicKey.value) {
      return
    }
    if (state.token.label === 'sol') {
      const amount = new BN(Number(state.value) * LAMPORTS_PER_SOL)
      const receiver = new PublicKey(state.address)
      state.fee = await transferClient.value.getTransferFee({
        policy,
        amount,
        receiver,
        proofRequest: certificate.value.pubkey,
      }) / LAMPORTS_PER_SOL
    } else {
      if (!publicKey.value || !state.token.mint) {
        return
      }
      const tokenInfo = tokenState.tokens.find(t => t.mint === state.token.mint)
      if (!tokenInfo || !tokenMint.value || !receiver.value || !wallet.value) {
        return
      }

      const source = await getAssociatedTokenAddress(tokenMint.value, publicKey.value)
      const amount = new BN(Number(state.value) * (10 ** tokenInfo.decimals))

      state.fee = await transferClient.value.getTransferTokenFee({
        policy,
        destination: destinationTokenAcc.value,
        source,
        tokenMint: tokenMint.value,
        amount,
        receiver: receiver.value,
        proofRequest: certificate.value.pubkey,
      }) / LAMPORTS_PER_SOL
    }
  }

  async function verifyTransfer() {
    try {
      state.loading = true
      // TODO: change check
      console.log('[debug] on transfer certificate === ', certificate.value)
      if (certificateValid.value) {
        let signature
        if (state.token.label === 'sol') {
          signature = await verifiedTransferSOL()
        } else {
          signature = await verifiedTransferToken()
        }
        // TODO: refactory notifications
        notify({
          type: 'positive',
          message: 'Transaction confirmed',
          actions: [{
            label: 'Explore',
            color: 'white',
            target: '_blank',
            href: `https://explorer.solana.com/tx/${signature}?cluster=${connectionStore.cluster}`,
            onClick: () => false,
          }],
        })
        reset()
        await getUserTokens()
      } else {
        startCreateCertificate()
      }
    } catch (e) {
      console.error('verifyTransfer error: ', e)
      notify({
        type: 'negative',
        message: `${e}`,
      })
    } finally {
      state.loading = false
    }
  }

  async function verifiedTransferSOL() {
    const amount = new BN(Number(state.value) * LAMPORTS_PER_SOL)
    const receiver = new PublicKey(state.address)
    return await transferClient.value.transfer({
      amount,
      receiver,
      proofRequest: certificate.value.pubkey,
      policy: new PublicKey(requiredPolicy.value),
    })
  }

  async function verifiedTransferToken() {
    if (!publicKey.value || !state.token.mint) {
      return
    }
    const tokenInfo = tokenState.tokens.find(t => t.mint === state.token.mint)
    if (!tokenInfo || !tokenMint.value || !receiver.value || !wallet.value) {
      return
    }

    const source = await getAssociatedTokenAddress(tokenMint.value, publicKey.value)
    const amount = new BN(Number(state.value) * (10 ** tokenInfo.decimals))
    return await transferClient.value.transferToken({
      destination: destinationTokenAcc.value,
      source,
      tokenMint: tokenMint.value,
      amount,
      receiver: receiver.value,
      proofRequest: certificate.value.pubkey,
      policy: new PublicKey(requiredPolicy.value),
    })
  }

  function setMax(amount: number) {
    state.value = amount
  }

  function setToken(t: SwapData) {
    state.token = t
  }

  return {
    state,
    setMax,
    setToken,
    verifyTransfer,
  }
})

interface TransferState {
  address: string
  value?: number
  loading: boolean
  token: SwapData
  fee: number
  valid: boolean
  status?: IProofRequestStatus
}
