import { defineStore } from 'pinia'
import { useAnchorWallet } from 'solana-wallets-vue'

import type { PublicKeyInitData } from '@solana/web3.js'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

// import { ZKPRequestStatus } from '@albus/monorepo/packages/albus-sdk/src/generated'
import { AlbusClient } from '@albus/monorepo/packages/albus-sdk/src'
import { VerifiedTransferClient } from '@albus/monorepo/packages/verified-transfer-sdk'
import { BN } from '@coral-xyz/anchor'
import { newProvider } from '@/utils'

// import { newProvider } from '@/utils'

export const useClientStore = defineStore('client', () => {
  const { monitorTransaction } = useMonitorTransaction()

  const connectionStore = useConnectionStore()
  const anchorWallet = useAnchorWallet()

  let client: AlbusClient
  let verifiedTransferClient: VerifiedTransferClient

  const serviceCode = 'test'
  const testCircuit = 'EByLSRhVR2JhpVwj1CsRNKJ5DVpG8Nu4oDByu2aW8PMv'

  watch(anchorWallet, (w) => {
    if (w) {
      const provider = newProvider(w, connectionStore.connection)
      client = new AlbusClient(provider)
      verifiedTransferClient = new VerifiedTransferClient(provider)
      console.log(client)
      console.log(verifiedTransferClient)
    }
  }, { deep: true, immediate: true })

  const loadZKPRequest = async () => {
    const pubkey = anchorWallet.value?.publicKey as PublicKey
    const circuit = new PublicKey(testCircuit)

    const [serviceProvider] = client.getServiceProviderPDA(serviceCode)
    const [zkpRequest] = client.getZKPRequestPDA(serviceProvider, circuit, pubkey)
    return zkpRequest
  }

  const loadZKPRequestStatus = async () => {
    const zkpRequest = await loadZKPRequest()
    const zkp = await client.loadZKPRequest(zkpRequest)
    const zkpStatus = zkp.status
    // console.log('ZKP Status: ', ZKPRequestStatus[zkpStatus])
    console.log('ZKP Request: ', zkpRequest.toBase58())
    return zkp.status
  }

  async function verifieStatus() {
    /* try {
      const zkpStatus = await loadZKPRequestStatus()
      if (zkpStatus === ZKPRequestStatus.Pending) {
        console.log('PENDING============')
        return ZKPRequestStatus.Pending
      } else if (zkpStatus === ZKPRequestStatus.Proved) {
        console.log('PROVED============')
        return ZKPRequestStatus.Proved
      } else {
        console.log('VERIFIED============')
        return ZKPRequestStatus.Verified
      }
    } catch (e) {
      if (String(e).includes('Unable to find ZKPRequest')) {
        return ZKPRequestStatusWithEmpty.Empty
      }
    } */
  }

  async function createZKPRequest() {
    await monitorTransaction(client.createZKPRequest(
      {
        circuit: testCircuit,
        serviceCode,
      },
    ))
  }

  async function verifieTransferSOL(ZKPRequestAddress: PublicKey, value: Number, address: PublicKeyInitData) {
    await verifiedTransferClient.transfer({
      amount: new BN(Number(value) * LAMPORTS_PER_SOL),
      receiver: new PublicKey(address),
      zkpRequest: ZKPRequestAddress,
    })
  }

  async function verifiedTransferToken(
    receiver: PublicKeyInitData,
    source: PublicKeyInitData,
    destination: PublicKeyInitData,
    ZKPRequestAddress: PublicKey,
    tokenMint: PublicKey,
    amount: number) {
    await verifiedTransferClient.splTransfer({
      destination: new PublicKey(destination),
      source: new PublicKey(source),
      tokenMint,
      amount: new BN(Number(amount) * LAMPORTS_PER_SOL),
      receiver: new PublicKey(receiver),
      zkpRequest: ZKPRequestAddress,
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

  return {
    loadZKPRequest,
    createZKPRequest,
    verifieStatus,
    verifieTransferSOL,
    verifiedTransferToken,
  }
})
