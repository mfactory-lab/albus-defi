import type { PublicKeyInitData } from '@solana/web3.js'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useAnchorWallet } from 'solana-wallets-vue'
import BN from 'bn.js'
import type { SwapData } from './swap'
import { createTransaction, sendTransaction } from '@/utils'

export function useTransfer() {
  const { monitorTransaction } = useMonitorTransaction()
  const connectionStore = useConnectionStore()
  const clientStore = useClientStore()
  const { reloadUserTokens } = useUserStore()
  const transferStore = useTransferStore()

  const { state } = useTransferStore()

  const wallet = useAnchorWallet()

  async function verifieTransfer() {
    try {
      state.loading = true
      clientStore.state.requestStatus = await clientStore.verifieStatus()
      if (clientStore.state.requestStatus === IProofRequestStatus.Proved) {
      // verifiedTransferSOL()
        await transferSol()
      }
    } finally {
      state.loading = false
    }
  }

  async function verifiedTransferSOL() {
    const zkpRequest = clientStore.proofRequestAddress
    const amount = new BN(Number(transferStore.state.value) * LAMPORTS_PER_SOL)
    const receiver = new PublicKey(transferStore.state.address)
    await clientStore.verifiedTransferClient!.transfer({
      amount,
      receiver,
      zkpRequest,
    })
  }

  async function transferSol() {
    const { instructions } = await createTransaction(
      wallet.value?.publicKey as PublicKey, state.address, Number(state.value), connectionStore.connection)

    await monitorTransaction(
      sendTransaction(connectionStore.connection, wallet.value!, instructions),
      {
        commitment: 'finalized',
        onSuccess: reloadUserTokens,
      },
    )
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
  return {
    setMax,
    setToken,
    verifieTransfer,
  }
}
