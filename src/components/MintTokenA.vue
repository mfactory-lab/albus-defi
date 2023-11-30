<script setup lang="ts">
import { Keypair, PublicKey } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import { useWallet } from 'solana-wallets-vue'

const { publicKey } = useWallet()
const connectionStore = useConnectionStore()
const userStore = useUserStore()
const loading = ref(false)
const { notify } = useQuasar()

async function mintTokenB() {
  if (publicKey.value) {
    loading.value = true
    console.log('mintTokenB -------------------------')
    try {
      const payer = Keypair.fromSecretKey(bs58.decode('2QDdinbDitrdSrbvyddwrc1sdQEyRtMgXSisj5QfFgSikxgmPp4ggunwjQZChcvKFxr74XbUwYGmiqivq3SMARhx'))
      const tokenA = new PublicKey('6rdejLXbi2Ws2z3Ff1wRhRS9WqrXRDuM8YpSkiektRgw')
      const userTokenA = await getOrCreateAssociatedTokenAccount(connectionStore.connection, payer, tokenA, publicKey.value)
      await mintTo(connectionStore.connection, payer, tokenA, userTokenA.address, payer, 10_000_000_000)
      await userStore.getUserTokens()
      notify({
        type: 'positive',
        message: 'You got 10 TOKEN_B',
      })
    } catch (e) {
      console.log('failed mint e:', e)
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <q-btn
    v-if="connectionStore.cluster === 'devnet' && publicKey"
    class="full-width"
    :loading="loading"
    unelevated
    :color="$q.dark.isActive ? 'white' : 'primary'"
    @click="mintTokenB"
  >
    Mint TOKEN_B
  </q-btn>
</template>
