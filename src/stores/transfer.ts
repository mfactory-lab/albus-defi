import { defineStore } from 'pinia'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import type { PublicKeyInitData } from '@solana/web3.js'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { VerifiedTransferClient } from 'albus/packages/verified-transfer-sdk/src/client'
import { AlbusClient } from 'albus/packages/albus-sdk/src/client'
import { ZKPRequestStatus } from 'albus/packages/albus-sdk/src/generated/types'
import type { WalletAdapter } from '@metaplex-foundation/js'
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import type { SwapData } from './swap'
import solToken from '@/assets/img/tokens/sol.png'
import { mintNFT, newProvider, transactionFee, validateAddress } from '@/utils'

export const useTransferStore = defineStore('transfer', () => {
  const { monitorTransaction } = useMonitorTransaction()
  const connectionStore = useConnectionStore()
  const { getTokens } = useUserStore()

  const userStore = useUserStore()

  const defaultFee = 0.00

  const wallet = useWallet()
  const anchorWallet = useAnchorWallet()

  const token = reactive<SwapData>({ image: solToken, value: 'sol', label: 'sol' })

  const state = reactive<TransferState>({
    address: '',
    value: undefined,
    loading: false,
    token,
    fee: defaultFee,
    valid: false,
  })

  const serviceCode = 'test'
  const testCircuit = 'EByLSRhVR2JhpVwj1CsRNKJ5DVpG8Nu4oDByu2aW8PMv'

  let client: AlbusClient
  let verifiedTransferClient: VerifiedTransferClient

  watch(anchorWallet, (w) => {
    if (w) {
      const provider = newProvider(w, connectionStore.connection)
      client = new AlbusClient(provider)
      verifiedTransferClient = new VerifiedTransferClient(provider)
    }
  }, { deep: true, immediate: true })

  async function verifieTransfer() {
    const pubkey = wallet.publicKey.value as PublicKey
    const circuit = new PublicKey(testCircuit)

    const [serviceProvider] = client.getServiceProviderPDA(serviceCode)
    const [zkpRequest] = client.getZKPRequestPDA(serviceProvider, circuit, pubkey)

    try {
      const zkp = await client.loadZKPRequest(zkpRequest)
      const zkpStatus = zkp.status
      console.log('ZKP Request: ', zkpRequest.toBase58())
      console.log('ZKP Status: ', ZKPRequestStatus[zkpStatus])

      if (zkpStatus === ZKPRequestStatus.Pending) {
        let proofNft: any = { address: '' }
        if (userStore.state.proofNfts.length !== 0) {
          proofNft.address = userStore.state.proofNfts[0].mint
        } else {
          proofNft = await mintProofNft()
        }
        console.log(proofNft)
        await proovZKPRequest(zkpRequest, proofNft.address)
      } else if (zkpStatus === ZKPRequestStatus.Proved) {
        console.log('PROVED============')
        await verifiedZKPRequest(zkpRequest)
        /* const res = await verifieTransferSOL(zkpRequest)
        console.log('Transfer: ', res) */
      }
    } catch (e) {
      // createZKPRequest()
      console.log(e)
    }
  }

  /*   async function verifieTransferSOL(ZKPRequestAddress: PublicKey) {
    await verifiedTransferClient.transfer({
      amount: new BN(Number(state.value) * LAMPORTS_PER_SOL),
      receiver: new PublicKey(state.address),
      zkpRequest: ZKPRequestAddress,
    })
  } */

  async function mintProofNft() {
    const metaplex = Metaplex.make(connectionStore.connection).use(walletAdapterIdentity(anchorWallet.value as WalletAdapter))
    return await mintNFT(metaplex, 'ALBUS-P')
  }

  async function createZKPRequest() {
    await client.createZKPRequest({
      circuit: testCircuit,
      serviceCode,
    })
  }

  async function verifiedZKPRequest(ZKPRequestAddress: PublicKeyInitData) {
    return await client.verify({
      zkpRequest: ZKPRequestAddress,
    })
  }

  async function proovZKPRequest(ZKPRequestAddress: PublicKeyInitData, proofNft: PublicKeyInitData) {
    return await client.prove({
      zkpRequest: ZKPRequestAddress,
      proofMint: proofNft,
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

  async function createTransaction() {
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
  }

  async function getTransactionFee() {
    const transaction = await createTransaction()
    state.fee = await transactionFee(transaction, connectionStore.connection)
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
}
