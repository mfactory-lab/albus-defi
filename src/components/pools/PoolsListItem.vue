<script setup lang="ts">
import type { TokenSwap } from '@albus-finance/swap-sdk'
import type { PublicKey } from '@solana/web3.js'
import { formatPct, formatUsd } from '@/utils'
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

const fees = computed(() => props.data && swapStore.getPoolFee(props.data))
const swapFee = computed(() => fees.value && (fees.value.ownerTrade + fees.value.trade))

const dialog = ref(false)
</script>

<template>
  <q-card v-if="pubkey && data && tokenAData && tokenBData" class="pool-card" @click="useEmit ? $emit('selectPool') : undefined">
    <q-card-section class="pool-card__body full-height">
      <div class="row">
        <div class="pool-card__icons row justify-center q-mr-md q-ml-sm">
          <img v-if="tokenAData?.image" :src="tokenAData?.image" :alt="tokenAData?.symbol">
          <img v-if="tokenBData?.image" :src="tokenBData?.image" :alt="tokenBData?.symbol">
        </div>
        <div class="pool-card__subtitle row justify-center items-center">
          <span>{{ tokenAData?.symbol }}/{{ tokenBData?.symbol }}</span>
        </div>
        <span class="policy-info q-ml-auto">
          i
          <q-menu v-model="dialog" transition-duration="100" transition-show="fade" transition-hide="fade">
            <q-card class="pool-info q-pa-md">
              <div class="pool-info__fees row items-center">
                <div>
                  <div class="pool-card__label">
                    Swap fee
                  </div>
                  <div v-if="swapFee" class="pool-card__amount">
                    {{ formatPct.format(swapFee) }}
                  </div>
                </div>
                <div class="pool-info__delimiter" />
                <div>
                  <div class="pool-card__label">
                    Withdraw fee
                  </div>
                  <div v-if="fees" class="pool-card__amount">
                    {{ formatPct.format(fees.ownerWithdraw) }}
                  </div>
                </div>
              </div>
              <div class="pool-info__addresses">
                <div class="column justify-center items-between q-mt-md">
                  <div class="pool-card__label">
                    Pool address
                  </div>
                  <div class="row justify-between items-center">
                    <span class="pool-card__pubkey monoscaped">{{ shortenAddress(pubkey.toBase58(), 14) }}</span>
                    <copy-to-clipboard :text="pubkey.toBase58()" />
                  </div>
                </div>
                <div class="column justify-center items-between">
                  <div class="pool-card__label">
                    Token A mint
                  </div>
                  <div class="row justify-between items-center">
                    <span class="pool-card__pubkey monoscaped">{{ shortenAddress(data.tokenAMint.toBase58(), 14) }}</span>
                    <copy-to-clipboard :text="data.tokenAMint.toBase58()" />
                  </div>
                </div>
                <div class="column justify-center items-between">
                  <div class="pool-card__label">
                    Token B mint
                  </div>
                  <div class="row justify-between items-center">
                    <span class="pool-card__pubkey monoscaped">{{ shortenAddress(data.tokenBMint.toBase58(), 14) }}</span>
                    <copy-to-clipboard :text="data.tokenBMint.toBase58()" />
                  </div>
                </div>
                <div class="column justify-center items-between">
                  <div class="pool-card__label">
                    LP token mint
                  </div>
                  <div class="row justify-between items-center">
                    <span class="pool-card__pubkey monoscaped">{{ shortenAddress(data.poolMint.toBase58(), 14) }}</span>
                    <copy-to-clipboard :text="data.poolMint.toBase58()" />
                  </div>
                </div>
              </div>
            </q-card>
          </q-menu>
        </span>
      </div>

      <div class="pool-card__income q-mt-md">
        <div>
          <div class="pool-card__apr-label">
            APR 24H
          </div>
          <div class="pool-card__apr-amount">
            {{ poolStats ? `${formatPct.format(poolStats.apr24)}` : '---' }}
          </div>
        </div>
        <div class="pool-card__income__user row q-ml-auto">
          <div>
            <div class="pool-card__label">
              My Liquidity
            </div>
            <div class="pool-card__amount">
              {{ poolStats && userTokens ? `$${formatUsd.format(userTokens / poolStats.poolTokenSupply * poolStats.tvl)}` : '---' }}
            </div>
          </div>
          <div class="q-ml-md">
            <div class="pool-card__label">
              My Share
            </div>
            <div class="pool-card__amount">
              {{ poolStats && userTokens ? `${formatPct.format(userTokens / poolStats.poolTokenSupply)}` : '---' }}
            </div>
          </div>
        </div>
      </div>

      <div class="pool-card__stats q-mt-sm q-mb-auto q-pt-xs">
        <div class="pool-card__stats__item q-mt-xs text-center">
          <div class="pool-card__label">
            Volume 24H
          </div>
          <div class="pool-card__amount">
            {{ poolStats ? `$${formatUsd.format(poolStats.volume24)}` : '---' }}
          </div>
        </div>
        <div class="pool-card__stats__delimiter" />
        <div class="pool-card__stats__item q-mt-xs text-center">
          <div class="pool-card__label">
            Liquidity
          </div>
          <div class="pool-card__amount">
            {{ poolStats ? `$${formatUsd.format(poolStats.tvl)}` : '---' }}
          </div>
        </div>
        <div class="pool-card__stats__delimiter" />
        <div class="pool-card__stats__item q-mt-xs text-center">
          <div class="pool-card__label">
            Fees 24H
          </div>
          <div class="pool-card__amount">
            {{ poolStats ? `$${formatUsd.format(poolStats.fees24)}` : '---' }}
          </div>
        </div>
      </div>

      <!-- <div class="q-mt-md row justify-center">
        <policy-card-view :required-policy="data.policy?.toBase58()" :required-policy-data="policyData?.data" />
      </div> -->

      <div v-if="!useEmit" class="row q-mt-md">
        <div class="col">
          <q-btn-group spread unelevated square class="pool-card__actions">
            <q-btn
              label="ADD LIQUIDITY"
              color="primary"
              text-color="white"
              target="_blank"
              class="q-mr-md"
              @click="swapAction(true)"
            />
            <q-btn
              label="SWAP"
              color="warning"
              text-color="black"
              target="_blank"
              @click="swapAction(false)"
            />
          </q-btn-group>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
