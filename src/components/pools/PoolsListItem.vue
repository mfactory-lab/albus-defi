<script setup lang="ts">
import { useWallet } from 'solana-wallets-vue'
import type { TokenSwap } from '@albus-finance/swap-sdk'
import type { PublicKey } from '@solana/web3.js'
import { formatBalance, formatPct } from '@/utils'
import { shortenAddress } from '~/utils/web3'
import type { PoolStats } from '@/stores'

const props = defineProps({
  pubkey: Object as PropType<PublicKey>,
  data: Object as PropType<TokenSwap>,
  poolStats: Object as PropType<PoolStats>,
  userTokens: Number,
  useEmit: Boolean,
})
defineEmits(['selectPool'])

const { connected } = useWallet()
const tokenStore = useTokenStore()
const tokens = computed(() => tokenStore.tokens)
const tokenAData = computed(() => tokens.value.find(t => t.mint === props.data?.tokenAMint.toBase58()))
const tokenBData = computed(() => tokens.value.find(t => t.mint === props.data?.tokenBMint.toBase58()))

// const userStore = useUserStore()
// const policyData = computed(() => userStore.servicePolicy.find(t => t.pubkey.toBase58() === props.data?.policy?.toBase58()))

const swapStore = useSwapStore()
const router = useRouter()
async function swapAction(liquidity = false) {
  if (tokenAData.value && tokenBData.value && props.pubkey && props.data) {
    swapStore.state.from = tokenAData.value
    swapStore.state.to = tokenBData.value
    await router.push(liquidity ? 'liquidity' : '/swap')
    swapStore.setTokenSwap({
      pubkey: props.pubkey,
      data: props.data,
    })
    console.log('[swap] swapAction: ', props.pubkey.toBase58())
  }
}

const fees = computed(() => {
  return props.data ? swapStore.getPoolFee(props.data) : {}
})

// @ts-expect-error valid params
const swapFee = computed(() => fees.value.ownerTrade + fees.value.trade)

const dialog = ref(false)
</script>

<template>
  <q-card v-if="pubkey && data && tokenAData && tokenBData" class="pool-card" @click="useEmit ? $emit('selectPool') : undefined">
    <q-card-section class="pool-card__body full-height">
      <div class="row">
        <div class="pool-card__icons row justify-center q-mr-md">
          <img v-if="tokenAData?.image" :src="tokenAData?.image" :alt="tokenAData?.symbol">
          <img v-if="tokenBData?.image" :src="tokenBData?.image" :alt="tokenBData?.symbol">
        </div>
        <div class="pool-card__subtitle row justify-center items-center">
          <span>{{ tokenAData?.symbol }} / {{ tokenBData?.symbol }}</span>
        </div>
        <span class="policy-info q-ml-auto" @click="dialog = true">
          i
        </span>
      </div>

      <div v-if="poolStats" class="row q-mt-sm q-mb-auto q-pt-xs pool-card__stats">
        <div class="row col-6 q-mt-xs">
          Liquidity:&nbsp;
          <span :class="{ 'full-width': $q.screen.lt.sm }">${{ formatBalance(poolStats.tvl, 2) }}</span>
        </div>
        <div class="row col-6 q-mt-xs">
          Volume 24h:&nbsp;
          <span :class="{ 'full-width': $q.screen.lt.sm }">${{ formatBalance(poolStats.volume24, 2) }}</span>
        </div>
        <div class="row col-6 q-mt-xs">
          Fees 24h:&nbsp;
          <span :class="{ 'full-width': $q.screen.lt.sm }">${{ formatBalance(poolStats.fees24, 2) }}</span>
        </div>
        <div class="row col-6 q-mt-xs">
          APR 24h:&nbsp;
          <span :class="{ 'full-width': $q.screen.lt.sm }">{{ formatPct.format(poolStats.apr24) }}</span>
        </div>
        <div v-if="userTokens && connected" class="q-py-md" />
        <div v-if="userTokens && connected" class="row col-6 q-mt-xs">
          Your Liquidity:&nbsp;
          <span :class="{ 'full-width': $q.screen.lt.sm }">${{ formatBalance(userTokens / poolStats.poolTokenSupply * poolStats.tvl, 2) }}</span>
        </div>
        <div v-if="userTokens && connected" class="row col-6 q-mt-xs">
          Your share:&nbsp;
          <span :class="{ 'full-width': $q.screen.lt.sm }">{{ formatPct.format(userTokens / poolStats.poolTokenSupply) }}</span>
        </div>
      </div>

      <!-- <div class="q-mt-md row justify-center">
        <policy-card-view :required-policy="data.policy?.toBase58()" :required-policy-data="policyData?.data" />
      </div> -->

      <div v-if="!useEmit" class="row q-mt-md">
        <div class="col">
          <q-btn-group spread>
            <q-btn
              label="ADD LIQUIDITY"
              color="warning"
              text-color="#282828"
              target="_blank"
              @click="swapAction(true)"
            />
            <q-btn
              label="SWAP"
              color="primary"
              text-color="white"
              target="_blank"
              @click="swapAction(false)"
            />
          </q-btn-group>
        </div>
      </div>
    </q-card-section>
    <q-dialog v-model="dialog" transition-duration="100" transition-show="fade" transition-hide="fade">
      <q-card class="q-pa-md">
        <div class="row items-center">
          Pool address:&nbsp;
          <span>
            <span class="pool-card__pubkey monoscaped">{{ shortenAddress(pubkey.toBase58()) }}</span>
            <copy-to-clipboard :text="pubkey.toBase58()" />
          </span>
        </div>
        <div class="row items-center">
          Token A mint:&nbsp;
          <span>
            <span class="pool-card__pubkey monoscaped">{{ shortenAddress(data.tokenAMint.toBase58()) }}</span>
            <copy-to-clipboard :text="data.tokenAMint.toBase58()" />
          </span>
        </div>
        <div class="row items-center">
          Token B mint:&nbsp;
          <span>
            <span class="pool-card__pubkey monoscaped">{{ shortenAddress(data.tokenBMint.toBase58()) }}</span>
            <copy-to-clipboard :text="data.tokenBMint.toBase58()" />
          </span>
        </div>
        <div class="row items-center">
          LP token mint:&nbsp;
          <span>
            <span class="pool-card__pubkey monoscaped">{{ shortenAddress(data.poolMint.toBase58()) }}</span>
            <copy-to-clipboard :text="data.poolMint.toBase58()" />
          </span>
        </div>
        <div class="row items-center q-mt-xs">
          Swap fee:&nbsp;
          <span class="pool-card__pubkey">{{ formatPct.format(swapFee) }}</span>
        </div>
        <div class="row items-center q-mt-xs">
          Withdraw fee:&nbsp;
          <span class="pool-card__pubkey">{{ formatPct.format(fees.ownerWithdraw) }}</span>
        </div>
      </q-card>
    </q-dialog>
  </q-card>
</template>
