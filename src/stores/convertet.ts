import { AnchorProvider, Program } from '@project-serum/anchor'
import { defineStore } from 'pinia'
import { Keypair } from '@solana/web3.js'
import { useAnchorWallet } from 'solana-wallets-vue'
import { SmartConverterClient } from '@/sdk/src'

export const useConverterStore = defineStore('converter', () => {
  const connectionStore = useConnectionStore()
  const anchorWallet = useAnchorWallet()

  function newProvider() {
    const userKeypair = Keypair.generate()
    const opts = AnchorProvider.defaultOptions()
    return new AnchorProvider(
      connectionStore.connection,
      userKeypair,
      opts,
    )
  }

  const converterClient = computed(() => {
    const provider = anchorWallet.value ?? newProvider()
    console.log(provider)
    return new SmartConverterClient({
      program: new Program(SmartConverterClient.IDL, SmartConverterClient.programId, provider),
      wallet: provider,
    })
  })

  watch(converterClient, async (c) => {
    const m = await converterClient.value.findManagers()
    console.log(m)
  }, { immediate: true })

  const state = reactive({
    from: {
      amount: 0,
    },
    to: {
      amount: 0,
    },
    converting: false,
    loading: false,
  })

  return {
    state,
  }
})
