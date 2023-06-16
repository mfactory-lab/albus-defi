import { defineStore } from 'pinia'
import { useWallet } from 'solana-wallets-vue'

// import { ZKPRequestStatus } from '@albus/monorepo/packages/albus-sdk/src/generated'
import { lowerCase } from 'lodash-es'
import type { PublicKey } from '@solana/web3.js'
import type { SwapData } from './swap'
import solToken from '@/assets/img/tokens/sol.png'
import { createTransaction, getMetadataPDA, transactionFee, validateAddress } from '@/utils'

enum NoZKPRequests {
  Empty = 4,
}

export const ZKPRequestStatusWithEmpty = { /* ...ZKPRequestStatus, */ ...NoZKPRequests }

export type ZKPRequestWithEmpty = NoZKPRequests /* | ZKPRequestStatus */

export const useTransferStore = defineStore('transfer', () => {
  const { monitorTransaction } = useMonitorTransaction()
  const connectionStore = useConnectionStore()
  const { verifieStatus, verifieTransferSOL } = useClientStore()
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
    state.status = await verifieStatus()
    // if (state.status === ZKPRequestStatus.Verified) {
    //    verifieTransferSOL()
    // }
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

  /* async function transferSOL() {
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
  } */

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
  status?: ZKPRequestWithEmpty
}
