import { AnchorProvider } from '@coral-xyz/anchor'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { AlbusTransferClient } from '@mfactory-lab/albus-transfer-sdk'
import BN from 'bn.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import type { SwapData } from './swap'
import { createTransaction, sendTransaction } from '@/utils'

export function useTransfer() {
  const { monitorTransaction } = useMonitorTransaction()
  const connectionStore = useConnectionStore()
  const userStore = useUserStore()
  const { reloadUserTokens } = useUserStore()
  const transferStore = useTransferStore()

  const { state } = useTransferStore()

  const wallet = useAnchorWallet()
  const { publicKey } = useWallet()

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
      // clientStore.state.requestStatus = await clientStore.verifyStatus()
      // if (clientStore.state.requestStatus === IProofRequestStatus.Proved) {
      console.log('certificate === ', userStore.certificate)
      console.log('certificate?.status === ', userStore.certificate?.data.status)
      if (userStore.certificate?.data.status === 2) {
        console.log(state.token)
        if (state.token.label === 'sol') {
          await verifiedTransferSOL()
        } else {
          await verifiedTransferToken()
        }
      }
    } catch (e) {
      console.error('verifyTransfer error: ', e)
    } finally {
      state.loading = false
    }
  }

  async function verifiedTransferSOL() {
    // const zkpRequest = clientStore.proofRequestAddress
    // console.log('zkpRequest === ', zkpRequest)
    const amount = new BN(Number(transferStore.state.value) * LAMPORTS_PER_SOL)
    const receiver = new PublicKey(transferStore.state.address)
    await transferClient.value.transfer({
      amount,
      receiver,
      proofRequest: userStore.certificate.pubkey,
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

  async function verifiedTransferToken() {
    if (!publicKey.value) {
      return
    }
    const tokenMint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')
    const receiver = new PublicKey(transferStore.state.address)
    const source = await getAssociatedTokenAddress(tokenMint, publicKey.value)
    const destination = await getAssociatedTokenAddress(tokenMint, receiver)
    const amount = new BN(Number(transferStore.state.value) * 1000000)
    await transferClient.value.transferToken({
      destination,
      source,
      tokenMint,
      amount,
      receiver,
      proofRequest: userStore.certificate.pubkey,
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
    verifyTransfer,
  }
}
