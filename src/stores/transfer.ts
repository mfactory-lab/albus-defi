import { defineStore } from 'pinia'
import { useWallet } from 'solana-wallets-vue'

import { lowerCase } from 'lodash-es'
import type { PublicKeyInitData } from '@solana/web3.js'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { ProofRequestStatus } from '@albus/monorepo/packages/albus-sdk/src'
import BN from 'bn.js'
import type { SwapData } from './swap'
import type { ProofRequestWithEmpty } from './client'
import solToken from '@/assets/img/tokens/sol.png'
import { createTransaction, getMetadataPDA, transactionFee, validateAddress } from '@/utils'

export const useTransferStore = defineStore('transfer', () => {
  const { monitorTransaction } = useMonitorTransaction()
  const connectionStore = useConnectionStore()
  const clientStore = useClientStore()
  const { state: tokenState } = useUserStore()

  const defaultFee = 0.00

  const wallet = useWallet()

  const token = reactive<SwapData>({ image: solToken, value: 'sol', label: 'sol' })

  const state = reactive<TransferState>({
    address: '',
    value: undefined,
    loading: false,
    token,
    fee: defaultFee,
    valid: false,
    status: undefined,
  })

  async function verifieTransfer() {
    state.status = await clientStore.verifieStatus()
    if (state.status === ProofRequestStatus.Proved) {
      // verifiedTransferSOL()
    }
  }

  async function verifiedTransferSOL() {
    const zkpRequest = clientStore.proofRequestAddress
    const amount = new BN(Number(state.value) * LAMPORTS_PER_SOL)
    const receiver = new PublicKey(state.address)
    await clientStore.verifiedTransferClient!.transfer({
      amount,
      receiver,
      zkpRequest,
    })
  }

  async function verifiedTransferToken(
    receiver: PublicKeyInitData,
    source: PublicKeyInitData,
    destination: PublicKeyInitData,
    ZKPRequestAddress: PublicKey,
    tokenMint: PublicKey,
    amount: number) {
    await clientStore.verifiedTransferClient!.splTransfer({
      destination: new PublicKey(destination),
      source: new PublicKey(source),
      tokenMint,
      amount: new BN(Number(amount) * LAMPORTS_PER_SOL),
      receiver: new PublicKey(receiver),
      zkpRequest: ZKPRequestAddress,
    })
  }

  function setMax(amount: number) {
    state.value = amount
  }

  function setToken(t: SwapData) {
    state.token = t
  }

  function clearState() {
    state.address = ''
    state.value = undefined
    state.fee = defaultFee
  }

  watch(() => state.token, () => {
    clearState()
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

  /* async function createTransaction() {
    const provider = new PublicKey(wallet.publicKey.value as PublicKey)
    const recieverWallet = new PublicKey(state.address)

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider,
        toPubkey: recieverWallet,
        lamports: Number(state.value) * LAMPORTS_PER_SOL,
      }),
    )

    const blockhash = (await connectionStore.connection.getLatestBlockhash('finalized')).blockhash
    transaction.recentBlockhash = blockhash
    transaction.feePayer = new PublicKey(String(wallet.publicKey.value))

    return transaction
  } */

  async function getTokenAccount() {
    const symbol = state.token.label
    const token = tokenState.tokens.find(t => lowerCase(t.symbol) === lowerCase(symbol))
    if (symbol === 'sol') {
      return true
    } else if (!token || !token.mint) {
      return false
    } else {
      return !!getMetadataPDA(token.mint)
    }
  }

  async function getTransactionFee() {
    const isAccountExist = await getTokenAccount()
    const transaction = await createTransaction(
      wallet.publicKey.value as PublicKey, state.address, Number(state.value), connectionStore.connection)

    const fee = await transactionFee(transaction, connectionStore.connection)
    state.fee = !isAccountExist ? fee + 0.02 : fee
  }

  return {
    state,
    setMax,
    setToken,
    verifieTransfer,
  }
})

interface TransferState {
  address: string
  value?: number
  loading: boolean
  token: SwapData
  fee: number
  valid: boolean
  status?: ProofRequestWithEmpty
}
