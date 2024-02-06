import { defineStore } from 'pinia'
import { useAnchorWallet } from 'solana-wallets-vue'
import { SmartConverterClient } from '@/sdk/src'

export const useConverterStore = defineStore('converter', () => {
  const connectionStore = useConnectionStore()
  const anchorWallet = useAnchorWallet()

  const converterClient = computed(() => {
    return SmartConverterClient.fromWallet(connectionStore.connection, anchorWallet.value)
  })

  watch(converterClient, async (c) => {
    if (c.provider.publicKey.toBase58() !== '9SwiEpL5AnkYC2SCYGvWVQ2VLhN55osuEprecAXUGuse') {
      return
    }
    /*  try {
      const mintA = new PublicKey('5d3vLM78TbzgjhHMZAtBWBteh8HS1fjkaNTiVBndJqP2')
      const mintB = new PublicKey('CEWptykxAS8nqSQx1eVz43eSPSXF1nnsWcK1fKYUtz2x')
      const policy = new PublicKey('ANGgdHwXQd9UmfZdHvMDJ6b5ATzrmTCJz4bcbZzB5a76')
      const tx = await converterClient.value.addPair({
        ratio: {
          num: 10,
          denom: 1,
        },
        tokenA: mintA,
        tokenB: mintB,
        policy,
      })
      console.log(tx)
    } catch (err) {
      console.log(err)
    } */
    console.log(c)
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
