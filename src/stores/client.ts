import { defineStore } from 'pinia'
import { useAnchorWallet } from 'solana-wallets-vue'

import type { PublicKeyInitData } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'

import { AlbusClient, ProofRequestStatus } from '@albus/monorepo/packages/albus-sdk/src'
import { VerifiedTransferClient } from '@albus/monorepo/packages/verified-transfer-sdk'
import { newProvider } from '@/utils'

enum NoZKPRequests {
  Empty = 4,
}

export const ProofRequestStatusWithEmpty = { ...ProofRequestStatus, ...NoZKPRequests }

export type ProofRequestWithEmpty = NoZKPRequests | ProofRequestStatus

export const useClientStore = defineStore('client', () => {
  const { monitorTransaction } = useMonitorTransaction()

  const connectionStore = useConnectionStore()
  const anchorWallet = useAnchorWallet()

  const proofRequestAddress = ref()

  const client = ref<AlbusClient>()
  const verifiedTransferClient = ref<VerifiedTransferClient>()

  const serviceCode = 'test'
  const testCircuit = 'SAZUWFDXQpiqjrkitDj3LxGoLHKY9pq1AuZzhRqMMAh'

  watch(anchorWallet, (w) => {
    if (w) {
      const provider = newProvider(w, connectionStore.connection)
      client.value = new AlbusClient(provider)
      verifiedTransferClient.value = new VerifiedTransferClient(provider)
    }
  }, { deep: true, immediate: true })

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
    const zkpStatus = await loadZKPRequestStatus()
    if (zkpStatus === ProofRequestStatus.Pending) {
      console.log('PENDING============')
      return ProofRequestStatus.Pending
    } else if (zkpStatus === ProofRequestStatus.Proved) {
      console.log('PROVED============')
      return ProofRequestStatus.Proved
    } else if (zkpStatus === ProofRequestStatus.Verified) {
      console.log('VERIFIED============')
      return ProofRequestStatus.Verified
    } else {
      console.log('EMPTY============')
      return ProofRequestStatusWithEmpty.Empty
    }
  }

  async function loadZKPRequestStatus() {
    try {
      const proofRequest = await loadProofRequest()
      proofRequestAddress.value = proofRequest
      const zkp = await client.value!.loadProofRequest(proofRequest.toBase58())
      const zkpStatus = zkp.status
      console.log('ZKP Status: ', ProofRequestStatus[zkpStatus])
      console.log('ZKP Request: ', proofRequest.toBase58())
      return zkp.status
    } catch (e) {
      if (String(e).includes('Unable to find ZKPRequest')) {
        return ProofRequestStatusWithEmpty.Empty
      }
    }
  }

  async function verifiedZKPRequest(ZKPRequestAddress: PublicKeyInitData) {
    return await client.value!.verifyProofRequest({
      zkpRequest: ZKPRequestAddress,
    })
  }

  async function proovZKPRequest(ZKPRequestAddress: PublicKeyInitData) {
    /* return await client.prove({
      proofRequest: ZKPRequestAddress,
    }) */
  }

  return {
    client,
    verifiedTransferClient,
    proofRequestAddress,
    verifieStatus,
    loadProofRequest,
    createProofRequest,
  }
})
