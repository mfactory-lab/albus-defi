import { defineStore } from 'pinia'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { AnchorProvider } from '@coral-xyz/anchor'
import { AlbusTransferClient } from '@mfactory-lab/albus-transfer-sdk'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import BN from 'bn.js'
import type { SwapData } from './swap'
import type { IProofRequestStatus } from '@/stores'
import { createTransaction, getMetadataPDA, startCreteCertificate, transactionFee, validateAddress } from '@/utils'
import { TRANSFER_FEE_CONST } from '@/config'

export const useTransferStore = defineStore('transfer', () => {
  const connectionStore = useConnectionStore()
  const { tokens } = useTokenStore()
  const userStore = useUserStore()
  const { state: tokenState, getUserTokens } = useUserStore()
  const certificate = computed(() => userStore.certificate)
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
  watch([tokenMint, receiver], async () => {
    if (tokenMint.value && receiver.value && state.valid) {
      return destinationTokenAcc.value = await getAssociatedTokenAddress(tokenMint.value, receiver.value)
    }
    destinationTokenAcc.value = ''
  })
  watch([() => state.valid, () => state.value, destinationTokenAcc], async ([v, s]) => {
    if (v && Number(s) > 0) {
      getTransactionFee()
    } else {
      state.fee = defaultFee
    }
  })

  async function getTokenAccount() {
    const symbol = state.token.label
    if (symbol === 'sol') {
      return true
    } else if (!destinationTokenAcc.value) {
      return false
    } else {
      // TODO: valid check if receiver has token account
      return !!getMetadataPDA(destinationTokenAcc.value)
    }
  }

  async function getTransactionFee() {
    const isAccountExist = await getTokenAccount()
    const transaction = await createTransaction(
      wallet.value?.publicKey as PublicKey, state.address, Number(state.value), connectionStore.connection)

    const fee = await transactionFee(transaction, connectionStore.connection) + TRANSFER_FEE_CONST
    state.fee = !isAccountExist ? fee + 0.02 : fee
  }

  const transferClient = computed(() => {
    return new AlbusTransferClient(
      new AnchorProvider(
        connectionStore.connection,
        wallet.value ?? { publicKey: PublicKey.default } as never,
        AnchorProvider.defaultOptions(),
      ),
    )
  })

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
        startCreteCertificate()
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
    })
  }

  async function verifiedTransferToken() {
    if (!publicKey.value || !state.token.mint) {
      return
    }
    const tokenInfo = tokenState.tokens.find(t => t.mint === state.token.mint)
    if (!tokenInfo || !tokenMint.value || !receiver.value) {
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
