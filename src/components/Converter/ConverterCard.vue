<script setup lang="ts">
import { Keypair, PublicKey } from '@solana/web3.js'
import { useWallet } from 'solana-wallets-vue'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import faucetIcon from '@/assets/img/icons/faucet-icon.svg'

const connectionStore = useConnectionStore()
const { publicKey } = useWallet()
const converterStore = useConverterStore()

const { notify } = useQuasar()

const tab = ref('lock')

const isDevnet = computed(() => connectionStore.cluster === 'devnet')

async function handleFaucet() {
  if (publicKey.value) {
    try {
      converterStore.state.loading = true
      const payer = Keypair.fromSecretKey(bs58.decode('38f57pVjJEb9wGuzAmonU2k76ctmrDWBVyn9v5hMMURLVqYC5xWwd31UhHAWmNkTwvh1r8d1SgNoLKTiDUDnTo1u'))
      const tokenA = new PublicKey('CDcwg5UiZcXBtQ7eBRZpSr23vHntpGotmmgCSoxAjfrM')
      const userTokenA = await getOrCreateAssociatedTokenAccount(connectionStore.connection, payer, tokenA, publicKey.value)
      await mintTo(connectionStore.connection, payer, tokenA, userTokenA.address, payer, 10_000_000_000)
      await converterStore.getAllTokens()
      converterStore.state.from.amount = 10
      notify({
        type: 'positive',
        message: 'You got 10 opTK',
      })
    } catch (e) {
      console.log('failed mint e:', e)
    } finally {
      converterStore.state.loading = false
    }
  }
}
</script>

<template>
  <div class="converter">
    <div v-if="converterStore.state.pairs.length !== 0 && isDevnet && publicKey" class="converter-faucet">
      <div class="converter-faucet__descr">
        To get the opTK token, click on faucet.
      </div>
      <img :src="faucetIcon" alt="faucet icon" @click="handleFaucet">
    </div>
    <q-card class="liquidity-tabs swap-card swap-widget">
      <q-tabs
        v-model="tab" align="justify" indicator-color="transparent"
        :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-grey-3'" active-color="white" active-bg-color="primary"
      >
        <q-tab :ripple="false" label="LOCK" name="lock" />
        <q-tab :ripple="false" label="UNLOCK" name="unlock" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="bg-transparent">
        <q-tab-panel name="lock">
          <lock-card />
        </q-tab-panel>

        <q-tab-panel name="unlock">
          <unlock-card />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<style lang="scss">
.converter {
  position: relative;
  display: flex;
  width: 450px;

  @media (max-width: $breakpoint-md) {
    flex-direction: column-reverse;
    align-items: center;
    gap: 20px;
  }

  &-faucet {
    min-width: 118px;
    width: 118px;
    position: absolute;
    left: -135px;

    @media (max-width: $breakpoint-md) {
      position: initial;
      left: 0;
    }

    &__descr {
      width: 100%;
      color: $secondary;
      font-size: 12px;
      font-weight: 400;
      line-height: 13px;
      margin-bottom: 14px;
    }

    img {
      width: 115px;
      object-fit: contain;
      cursor: pointer;
    }
  }
}
</style>
