import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { SystemProgram, Transaction } from '@solana/web3.js'
import {
  NATIVE_MINT,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import { sendTransaction, solToLamports } from '@/utils'
import { SOL_MINT } from '@/config'
import { withPriorityFees } from '@/features/priority-fee'

export function useWrapSol() {
  const wallet = useAnchorWallet()
  const { publicKey } = useWallet()
  const connectionStore = useConnectionStore()
  const { monitorTransaction } = useMonitorTransaction()
  const { notify } = useQuasar()
  const userStore = useUserStore()

  const state = reactive({
    amount: 0,
    processing: false,
  })

  async function wrapSol() {
    if (!state.amount) {
      return notify({
        type: 'negative',
        message: 'Enter SOL amount',
      })
    }

    if (!publicKey.value) {
      return notify({
        type: 'negative',
        message: 'Connect a wallet',
      })
    }

    if (!userStore.tokenBalance(SOL_MINT)) {
      return notify({
        type: 'negative',
        message: 'Insufficient funds',
      })
    }

    try {
      state.processing = true
      const tx = new Transaction()
      const tokenAcc = await getAssociatedTokenAddress(NATIVE_MINT, publicKey.value)
      try {
        await getAccount(connectionStore.connection, tokenAcc)
      } catch (error: unknown) {
        if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
          tx.add(
            createAssociatedTokenAccountInstruction(
              publicKey.value,
              tokenAcc,
              publicKey.value,
              NATIVE_MINT,
            ),
          )
        } else {
          throw error
        }
      }

      tx.add(
        SystemProgram.transfer({
          fromPubkey: publicKey.value,
          toPubkey: tokenAcc,
          lamports: solToLamports(state.amount),
        }),
        createSyncNativeInstruction(
          tokenAcc,
        ),
      )

      await monitorTransaction(
        sendTransaction(
          connectionStore.connection,
          wallet.value!,
          await withPriorityFees({ instructions: tx.instructions }),
        ),
        {
          onSuccess: () => {
            state.processing = false
            state.amount = 0
            userStore.getUserTokens()
            notify({
              type: 'positive',
              message: 'SOL wrapped successfully.',
            })
          },
        },
      )
    } catch (e) {
      notify({
        type: 'negative',
        message: `${e}`,
      })
    } finally {
      state.processing = false
    }
  }

  return {
    state,
    wrapSol,
  }
}
