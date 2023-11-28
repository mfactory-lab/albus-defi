<script setup lang="ts">
import type { TokenSwap } from '@albus-finance/swap-sdk'
import type { PublicKey } from '@solana/web3.js'

const props = defineProps({
  pubkey: Object as PropType<PublicKey>,
  data: Object as PropType<TokenSwap>,
  useEmit: Boolean,
})
defineEmits(['selectPool'])

const tokenStore = useTokenStore()
const tokens = computed(() => tokenStore.tokens)
const tokenAData = computed(() => tokens.value.find(t => t.mint === props.data?.tokenAMint.toBase58()))
const tokenBData = computed(() => tokens.value.find(t => t.mint === props.data?.tokenBMint.toBase58()))

const userStore = useUserStore()
const policyData = computed(() => userStore.servicePolicy.find(t => t.pubkey.toBase58() === props.data?.policy?.toBase58()))

const swapStore = useSwapStore()
const router = useRouter()
function swapAction() {
  if (tokenAData.value && tokenBData.value && props.pubkey && props.data) {
    swapStore.state.from = tokenAData.value
    swapStore.state.to = tokenBData.value
    swapStore.setTokenSwap({
      pubkey: props.pubkey,
      data: props.data,
    })
    router.push('/swap')
  }
}
</script>

<template>
  <q-card v-if="pubkey && data && tokenAData && tokenBData" class="pool-card">
    <q-card-section class="pool-card__head">
      <div class="row justify-center">
        {{ tokenAData?.symbol }} / {{ tokenBData?.symbol }}
      </div>
    </q-card-section>
    <q-card-section class="pool-card__body">
      <div class="pool-card__icons row justify-center">
        <img v-if="tokenAData?.image" :src="tokenAData?.image" :alt="tokenAData?.symbol">
        <img v-if="tokenBData?.image" :src="tokenBData?.image" :alt="tokenBData?.symbol">
      </div>

      <div class="q-mt-md">
        <div class="pool-card__subtitle">
          Pool info
        </div>
        <div class="row items-center">
          Pool address:&nbsp;
          <span>
            <span class="pool-card__pubkey monoscaped">{{ pubkey }}</span>
            <copy-to-clipboard :text="pubkey.toBase58()" />
          </span>
        </div>
        <div class="row items-center">
          Token A mint:&nbsp;
          <span>
            <span class="pool-card__pubkey monoscaped">{{ data.tokenAMint }}</span>
            <copy-to-clipboard :text="data.tokenAMint.toBase58()" />
          </span>
        </div>
        <div class="row items-center">
          Token B mint:&nbsp;
          <span>
            <span class="pool-card__pubkey monoscaped">{{ data.tokenBMint }}</span>
            <copy-to-clipboard :text="data.tokenBMint.toBase58()" />
          </span>
        </div>
      </div>

      <div class="q-mt-md row justify-center">
        <policy-card-view :required-policy="data.policy?.toBase58()" :required-policy-data="policyData?.data" />
      </div>

      <div class="row q-mt-md">
        <div class="col">
          <q-btn
            v-if="useEmit"
            class="full-width"
            label="SELECT"
            color="primary"
            text-color="white"
            target="_blank"
            @click="$emit('selectPool')"
          />
          <q-btn-group v-else spread>
            <q-btn
              disable
              label="ADD LIQUIDITY"
              color="warning"
              text-color="#282828"
              target="_blank"
              @click="swapAction"
            />
            <q-btn
              label="SWAP"
              color="info"
              text-color="white"
              target="_blank"
              @click="swapAction"
            />
          </q-btn-group>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
