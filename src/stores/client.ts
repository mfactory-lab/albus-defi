import { defineStore } from 'pinia'
import { useAnchorWallet } from 'solana-wallets-vue'

import type { PublicKeyInitData } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'

import { AlbusClient } from '@albus/sdk'

import { newProvider } from '@/utils'

export enum IProofRequestStatus {
  Pending,
  Proved,
  Verified,
  Rejected,
  Empty,
}

export const useClientStore = defineStore('client', () => {
  const { monitorTransaction } = useMonitorTransaction()

  const connectionStore = useConnectionStore()
  const anchorWallet = useAnchorWallet()

  const proofRequestAddress = ref()

  const client = ref<AlbusClient>()
  const verifiedTransferClient = ref<any>()

  const state = reactive<ClientState>({
    requestStatus: undefined,
    requests: undefined,
  })

  const serviceCode = 'test'
  const testCircuit = 'SAZUWFDXQpiqjrkitDj3LxGoLHKY9pq1AuZzhRqMMAh'

  watch(anchorWallet, async (w) => {
    if (w) {
      const provider = newProvider(w, connectionStore.connection)
      client.value = new AlbusClient(provider)
      state.requests = await getAllRequests()
      // verifiedTransferClient.value = new VerifiedTransferClient(provider)
    }
  }, { deep: true, immediate: true })

  async function getAllRequests() {
    return await client.value?.findProofRequests()
  }

  async function getVC(pabkey: PublicKey) {
    return await client.value!.loadCredential(pabkey)
  }

  const loadProofRequest = async () => {
    const pubkey = anchorWallet.value?.publicKey as PublicKey
    const circuit = new PublicKey(testCircuit)

    const [serviceProvider] = client.value!.getServiceProviderPDA(serviceCode)
    const [zkpRequest] = client.value!.getProofRequestPDA(serviceProvider, circuit, pubkey)

    return zkpRequest
  }

  async function createProofRequest() {
    await monitorTransaction(client.value!.createProofRequest(
      {
        circuit: testCircuit,
        serviceCode,
      },
    ))
  }

  async function verifieStatus() {
    const zkpStatus: any = await loadZKPRequestStatus()
    if (zkpStatus === IProofRequestStatus.Pending) {
      console.log('PENDING============')
      return IProofRequestStatus.Pending
    } else if (zkpStatus === IProofRequestStatus.Proved) {
      console.log('PROVED============')
      return IProofRequestStatus.Proved
    } else if (zkpStatus === IProofRequestStatus.Verified) {
      console.log('VERIFIED============')
      return IProofRequestStatus.Verified
    } else {
      console.log('EMPTY============')
      return IProofRequestStatus.Empty
    }
  }

  async function loadZKPRequestStatus() {
    try {
      const proofRequest = await loadProofRequest()
      proofRequestAddress.value = proofRequest
      const zkp = await client.value!.loadProofRequest(proofRequest.toBase58())
      const zkpStatus = zkp.status
      console.log('ZKP Status: ', IProofRequestStatus[zkpStatus])
      console.log('ZKP Request: ', proofRequest.toBase58())
      return zkpStatus
    } catch (e) {
      if (String(e).includes('Unable to find ZKPRequest')) {
        return IProofRequestStatus.Empty
      }
    }
  }

  async function verifiedZKPRequest(ZKPRequestAddress: PublicKeyInitData) {
    return await client.value!.verifyProofRequest({
      zkpRequest: ZKPRequestAddress,
    })
  }

  async function proveRequest(ZKPRequestAddress: PublicKeyInitData) {
    return await client.value!.prove({
      proofRequest: ZKPRequestAddress,
      vc: '',
    })
  }

  return {
    state,
    client,
    verifiedTransferClient,
    proofRequestAddress,
    verifieStatus,
    loadProofRequest,
    createProofRequest,
  }
})

interface ClientState {
  requestStatus?: IProofRequestStatus
  requests?: Array<any>
}
