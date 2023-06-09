import { defineStore } from 'pinia'
import { useAnchorWallet } from 'solana-wallets-vue'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import type { AnchorWallet } from 'solana-wallets-vue'
import type { SwapData } from './swap'
import solToken from '@/assets/img/tokens/sol.png'
import { sendTransaction, transactionFee, validateAddress } from '@/utils'

export const useTransferStore = defineStore('transfer', () => {
  const { monitorTransaction } = useMonitorTransaction()
  const connectionStore = useConnectionStore()
  const { getTokens } = useUserStore()

  const defaultFee = 0.00

  const wallet = useAnchorWallet()

  const token = reactive<SwapData>({ image: solToken, value: 'sol', label: 'sol' })

  const state = reactive<TransferState>({
    address: '',
    value: undefined,
    loading: false,
    token,
    fee: defaultFee,
    valid: false,
  })

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

  async function createTransaction() {
    const provider = new PublicKey(wallet.value?.publicKey as PublicKey)
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
    transaction.feePayer = wallet.value?.publicKey

    return transaction
  }

  async function getTransactionFee() {
    const transaction = await createTransaction()
    state.fee = await transactionFee(transaction, connectionStore.connection)
  }

  async function transferSOL() {
    try {
      state.loading = true
      const transaction = await createTransaction()
      const { instructions } = transaction

      console.log('instructions => ', instructions)

      await monitorTransaction(
        sendTransaction(
          connectionStore.connection,
          wallet.value as unknown as AnchorWallet,
          instructions,
          [],
        ),
        {
          onSuccess: async () => {
            console.log('[Transaction] Success')
            clearState()
            getTokens()
          },
        },
      )
    } finally {
      state.loading = false
    }
  }

  return {
    state,
    setMax,
    setToken,
    transferSOL,
  }
})

interface TransferState {
  address: string
  value?: number
  loading: boolean
  token: SwapData
  fee: number
  valid: boolean
}
