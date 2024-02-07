<script setup lang="ts">
// import { createSwap } from '@/utils/create-token-swap'
import { Keypair, PublicKey } from '@solana/web3.js'
import type { TokenData } from '@/config'

const {
  state,
  createTokenSwap,
  createPoolAccounts,
  generateSwapKeypair,
  createPoolMint,
  metadataState,
} = useCreateSwap()
const { handleSearchToken, tokens } = useToken()

const userStore = useUserStore()
const servicePolicy = computed(() => userStore.servicePolicy)
const balanceA = computed(() => state.tokenA ? userStore.tokenBalance(state.tokenA.mint) : 0)
const balanceB = computed(() => state.tokenB ? userStore.tokenBalance(state.tokenB.mint) : 0)

function setToken(field: 'tokenA' | 'tokenB', t: TokenData) {
  state[field] = t
}

const expandedTokenSwap = ref(false)
const expandedPoolMint = ref(false)
const tokenSwapSecret = ref('')
function setTokenSwap() {
  if (tokenSwapSecret.value) {
    state.tokenSwap = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(`[${tokenSwapSecret.value}]`)))
  }
}

const poolMint = ref('')
function setPoolMint() {
  if (poolMint.value) {
    state.poolMint = new PublicKey(poolMint.value)
  }
}
</script>

<template>
  <q-card class="swap-cardswap-widget full-width">
    <q-card-section class="swap-card__header">
      Create Pool
    </q-card-section>

    <q-card-section class="swap-card__body">
      <div class="row">
        <select-token
          :options="tokens" :token="state.tokenA" :swap-token="String(state.tokenA?.symbol)"
          @handle-search-token="handleSearchToken" @set-token="(t) => setToken('tokenA', t)"
        />
        <create-pool-token-data class="q-ml-lg q-mt-xs" :balance="balanceA" :mint="state.tokenA?.mint" />
      </div>
      <div class="row q-mt-md">
        <select-token
          :options="tokens" :token="state.tokenB" :swap-token="String(state.tokenB?.symbol)"
          @handle-search-token="handleSearchToken" @set-token="(t) => setToken('tokenB', t)"
        />
        <create-pool-token-data class="q-ml-lg q-mt-xs" :balance="balanceB" :mint="state.tokenB?.mint" />
      </div>

      <div class="q-mt-md">
        <div>Swap policy:</div>
        <q-select
          v-model="state.swapPolicy" option-disable="inactive" popup-content-class="transition-duration" outlined
          :options="servicePolicy" dense :options-dense="false"
          option-value="mint" option-label="name"
        >
          <template #selected>
            <select-policy-item
              v-if="state.swapPolicy"
              :key="state.swapPolicy.pubkey?.toBase58()"
              :policy="state.swapPolicy.pubkey"
              :policy-data="state.swapPolicy.data"
            />
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps" class="token-select__token">
              <select-policy-item :key="scope.opt.pubkey" :policy="scope.opt.pubkey" :policy-data="scope.opt.data" />
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="q-mt-md">
        <div>Liqudity policy:</div>
        <q-select
          v-model="state.addLiquidityPolicy" option-disable="inactive" popup-content-class="transition-duration" outlined
          :options="servicePolicy" dense :options-dense="false"
          option-value="mint" option-label="name"
        >
          <template #selected>
            <select-policy-item
              v-if="state.addLiquidityPolicy"
              :key="state.addLiquidityPolicy.pubkey?.toBase58()"
              :policy="state.addLiquidityPolicy.pubkey"
              :policy-data="state.addLiquidityPolicy.data"
            />
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps" class="token-select__token">
              <select-policy-item :key="scope.opt.pubkey" :policy="scope.opt.pubkey" :policy-data="scope.opt.data" />
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="row q-mt-md">
        <q-input v-model="state.hostFeeNumerator" class="q-mr-md" label="Host fee Numerator" />
        <q-input v-model="state.hostFeeDenominator" label="Host fee Denominator" />
      </div>
      <div class="row q-mt-md">
        <q-input v-model="state.tradeFeeNumerator" class="q-mr-md" label="Trade fee Numerator" />
        <q-input v-model="state.tradeFeeDenominator" label="Trade fee Denominator" />
      </div>
      <div class="row q-mt-md">
        <q-input v-model="state.ownerTradeFeeNumerator" class="q-mr-md" label="Owner trade fee Numerator" />
        <q-input v-model="state.ownerTradeFeeDenominator" label="Owner trade fee Denominator" />
      </div>
      <div class="row q-mt-md">
        <q-input v-model="state.ownerWithdrawFeeNumerator" class="q-mr-md" label="Owner withdraw fee Numerator" />
        <q-input v-model="state.ownerWithdrawFeeDenominator" label="Owner withdraw fee Denominator" />
      </div>

      <div class="q-mt-lg row">
        <q-btn class="q-ml-auto" @click="generateSwapKeypair">
          Generate Swap Keypair
        </q-btn>
      </div>
      <div class="q-mt-mt">
        <div class="text-subtitle2">
          Token Swap
        </div>
        <div>Public key: {{ state.tokenSwap?.publicKey.toBase58() }}</div>
        <div style="word-break: break-all">
          Secret key: {{ state.tokenSwap?.secretKey.toString() }}
        </div>
        <div v-if="state.tokenSwap">
          <copy-to-clipboard :text="state.tokenSwap.secretKey.toString()" />
          Copy Token Swap secret key
        </div>
      </div>
      <q-expansion-item
        v-model="expandedTokenSwap"
        label="Set token swap from secret key"
      >
        <q-input v-model="tokenSwapSecret" class="q-mr-md" label="Token Swap Secret" />
        <div class="q-mt-sm row">
          <q-btn class="q-ml-auto" :disable="!tokenSwapSecret" @click="setTokenSwap">
            Set Swap Keypair
          </q-btn>
        </div>
      </q-expansion-item>

      <div class="q-mt-xl column">
        <div>LP token metadata</div>
        <q-input v-model="metadataState.name" class="q-mr-md" label="name" />
        <q-input v-model="metadataState.symbol" class="q-mr-md" label="symbol" />
        <q-input v-model="metadataState.metadataUrl" class="q-mr-md" label="url" />
        <q-toggle v-model="metadataState.isMutable" class="q-mr-md q-mt-sm" size="lg" label="is Mutable" />
      </div>
      <div class="q-mt-xs row">
        <q-btn class="q-ml-auto" :disable="!!state.poolMint" :loading="state.creating" @click="createPoolMint">
          Create Pool Mint
        </q-btn>
      </div>
      <div>Pool mint: {{ state.poolMint?.toBase58() }}</div>
      <div v-if="state.poolMint">
        <copy-to-clipboard :text="state.poolMint?.toBase58()" />
        Copy Pool Mint public key
      </div>
      <q-expansion-item
        v-model="expandedPoolMint"
        label="Set pool mint manually"
      >
        <q-input v-model="poolMint" class="q-mr-md" label="Pool Mint" />
        <div class="q-mt-sm row">
          <q-btn class="q-ml-auto" :disable="!poolMint" @click="setPoolMint">
            Set Pool Mint
          </q-btn>
        </div>
      </q-expansion-item>

      <div class="q-mt-xl row">
        <q-btn class="q-ml-auto" :loading="state.creating" @click="createPoolAccounts">
          Create Pool token accounts
        </q-btn>
      </div>
      <div>Pool fee account: {{ state.poolFeeAccount?.toBase58() }}</div>
      <div>Pool token A account: {{ state.swapTokenA?.toBase58() }}</div>
      <div>Pool token B account: {{ state.swapTokenB?.toBase58() }}</div>
      <div class="text-warning">
        Top up pool tokenA and tokenB accounts before create pool
      </div>

      <div class="q-mt-xl row">
        <q-btn class="q-ml-auto" :loading="state.creating" @click="createTokenSwap">
          Create Pool
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
