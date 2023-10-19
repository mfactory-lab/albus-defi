import { defineStore } from 'pinia'
import { useAnchorWallet, useWallet } from 'solana-wallets-vue'
import { AlbusClient } from '@mfactory-lab/albus-sdk'

import type { PublicKeyInitData } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { SERVICE_CODE } from '@/config'

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
  const wallet = useWallet()

  const proofRequestAddress = ref()

  const client = computed(() => AlbusClient.factory(connectionStore.connection, wallet as any))

  const state = reactive<ClientState>({
    requestStatus: undefined,
  })

  const testCircuit = 'SAZUWFDXQpiqjrkitDj3LxGoLHKY9pq1AuZzhRqMMAh'

  watch(anchorWallet, async (w) => {
    if (w) {
      // const provider = newProvider(w, connectionStore.connection)
      // client.value = new AlbusClient(provider)
      // verifiedTransferClient.value = new VerifiedTransferClient(provider)
    }
  }, { deep: true, immediate: true })

  const loadProofRequest = async () => {
    const pubkey = anchorWallet.value?.publicKey as PublicKey
    const circuit = new PublicKey(testCircuit)

    const serviceProvider = await client.value!.service.loadById(SERVICE_CODE)
    console.log('serviceProvider === ', serviceProvider)
    const [zkpRequest] = client.value!.getProofRequestPDA(serviceProvider, circuit, pubkey)

    return zkpRequest
  }

  async function verifyStatus() {
    const zkpStatus: any = await loadZKPRequestStatus()
    console.log('zkpStatus============ ', zkpStatus)
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
      console.error('loadZKPRequestStatus error: ', e)
      if (String(e).includes('Unable to find ZKPRequest')) {
        return IProofRequestStatus.Empty
      }
    }
  }

  async function proveRequest(proofRequest: PublicKeyInitData, vc: PublicKeyInitData) {
    try {
      await monitorTransaction(client.value!.prove({ proofRequest, vc }))
    } catch (e) {
      console.log(e)
    }
  }

  async function verifiedZKPRequest(ZKPRequestAddress: PublicKeyInitData) {
    return await client.value!.verifyProofRequest({
      zkpRequest: ZKPRequestAddress,
    })
  }

  return {
    state,
    client,
    proofRequestAddress,
    proveRequest,
    verifyStatus,
    loadProofRequest,
  }
})

interface ClientState {
  requestStatus?: IProofRequestStatus
  requests?: Array<any>
}
