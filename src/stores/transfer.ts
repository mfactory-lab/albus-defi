import { defineStore } from 'pinia'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { lowerCase } from 'lodash-es'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { AnchorProvider } from '@coral-xyz/anchor'
import { AlbusTransferClient } from '@mfactory-lab/albus-transfer-sdk'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import BN from 'bn.js'
import type { SwapData } from './swap'
import type { IProofRequestStatus } from '@/stores'
import { createTransaction, getMetadataPDA, transactionFee, validateAddress } from '@/utils'

export const useTransferStore = defineStore('transfer', () => {
  const connectionStore = useConnectionStore()
  const { tokens } = useTokenStore()
  const userStore = useUserStore()
  const { state: tokenState, reloadUserTokens } = useUserStore()
  const certificate = computed(() => userStore.certificate)
  const defaultFee = 0.00

  const wallet = useAnchorWallet()
  const { publicKey } = useWallet()

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
  })

  watch(() => wallet.value?.publicKey, (p) => {
    if (!p) {
      reset()
      state.address = ''
    }
  })

  watch(() => state.address, async () => {
    state.valid = await validateAddress(state.address)
  })

  watch([() => state.valid, () => state.value], async ([v, s]) => {
    if (v && Number(s) > 0) {
      getTransactionFee()
    } else {
      state.fee = defaultFee
    }
  })

  async function getTokenAccount() {
    const symbol = state.token.label
    const token = tokenState.tokens.find(t => lowerCase(t.symbol) === lowerCase(symbol))
    if (symbol === 'sol') {
      return true
    } else if (!token || !token.mint) {
      return false
    } else {
      // TODO: valid check if receiver has token account
      return !!getMetadataPDA(token.mint)
    }
  }

  async function getTransactionFee() {
    const isAccountExist = await getTokenAccount()
    const transaction = await createTransaction(
      wallet.value?.publicKey as PublicKey, state.address, Number(state.value), connectionStore.connection)

    const fee = await transactionFee(transaction, connectionStore.connection)
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
      console.log('certificate === ', certificate.value)
      if (certificate.value?.data.status === 2) {
        console.log(state.token)
        if (state.token.label === 'sol') {
          await verifiedTransferSOL()
        } else {
          await verifiedTransferToken()
        }
        await reloadUserTokens()
      }
    } catch (e) {
      console.error('verifyTransfer error: ', e)
    } finally {
      state.loading = false
    }
  }

  async function verifiedTransferSOL() {
    const amount = new BN(Number(state.value) * LAMPORTS_PER_SOL)
    const receiver = new PublicKey(state.address)
    await transferClient.value.transfer({
      amount,
      receiver,
      proofRequest: certificate.value.pubkey,
    })
  }

  // TODO: errors
  async function verifiedTransferToken() {
    if (!publicKey.value || !state.token.mint) {
      return
    }
    const tokenInfo = tokenState.tokens.find(t => t.mint === state.token.mint)
    if (!tokenInfo) {
      return
    }
    const tokenMint = new PublicKey(state.token.mint)
    const receiver = new PublicKey(state.address)
    const source = await getAssociatedTokenAddress(tokenMint, publicKey.value)
    const destination = await getAssociatedTokenAddress(tokenMint, receiver)
    const amount = new BN(Number(state.value) * (10 ** tokenInfo.decimals))
    await transferClient.value.transferToken({
      destination,
      source,
      tokenMint,
      amount,
      receiver,
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
