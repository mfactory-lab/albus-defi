import { defineStore } from 'pinia'
import { useAnchorWallet } from 'solana-wallets-vue'

import { lowerCase } from 'lodash-es'
import type { PublicKey } from '@solana/web3.js'
import type { SwapData } from './swap'
import type { ProofRequestWithEmpty } from './client'
import solToken from '@/assets/img/tokens/sol.png'
import { createTransaction, getMetadataPDA, transactionFee, validateAddress } from '@/utils'

export const useTransferStore = defineStore('transfer', () => {
  const connectionStore = useConnectionStore()
  const { state: tokenState } = useUserStore()

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
      wallet.value?.publicKey as PublicKey, state.address, Number(state.value), connectionStore.connection)

    const fee = await transactionFee(transaction, connectionStore.connection)
    state.fee = !isAccountExist ? fee + 0.02 : fee
  }

  return {
    state,
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
