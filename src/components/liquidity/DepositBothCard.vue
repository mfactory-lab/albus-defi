<script setup lang="ts">
import { evaRefresh } from '@quasar/extras/eva-icons'
import { formatBalance, formatPct, lamportsToSol, onlyNumber } from '@/utils'
import { SOL_MINT, type TokenData } from '@/config'

const swapStore = useSwapStore()
const { state: swapState, loadingPoolTokens, setMax, loadPoolTokenAccounts } = swapStore
const tokenSwap = computed(() => swapStore.tokenSwap)

const liquidityStore = useLiquidityStore()
const { state, depositBothTokens, calcRate, openSlippage, closeSlippage } = liquidityStore

const { handleSearchToken, handleFilterToken, tokens } = useToken()
handleFilterToken(SOL_MINT)

const userStore = useUserStore()
const poolBalanceA = computed(() => swapState.poolBalance[swapState.from.mint] ? lamportsToSol(swapState.poolBalance[swapState.from.mint], swapState.from.decimals) : 0)
const poolBalanceB = computed(() => swapState.poolBalance[swapState.to.mint] ? lamportsToSol(swapState.poolBalance[swapState.to.mint], swapState.to.decimals) : 0)

const formatPercent = (n: number) => formatPct.format(n)

const balanceFrom = computed(() => userStore.tokenBalance(swapState.from.mint))
const balanceTo = computed(() => userStore.tokenBalance(swapState.to.mint))

function setToken(t: TokenData, direction: true) {
  swapState[direction ? 'to' : 'from'] = t
}

function setMaxAmount() {
  setMax(balanceFrom.value)
}

const insufficientAError = computed(() => {
  if (Number(state.amountTokenA) > balanceFrom.value) {
    return 'Insufficient funds'
  } else {
    return false
  }
})

const insufficientBError = computed(() => {
  if (Number(state.amountTokenB) > balanceTo.value) {
    return 'Insufficient funds'
  } else {
    return false
  }
})

watch([() => state.amountTokenA, balanceFrom, () => state.amountTokenB, balanceTo], (_a) => {
  state.active = !insufficientAError.value && !insufficientBError.value
})
</script>

<template>
  <q-card class="swap-card swap-widget">
    <q-card-section class="swap-card__header">
      Liquidity
    </q-card-section>

    <q-card-section class="swap-card__body">
      <div class="swap-form">
        <div class="swap-field">
          <div class="swap-field__info">
            <div class="row items-end justify-end">
              <div class="col-8 col-xs-10 row justify-end swap-field__balance">
                <div v-if="insufficientAError" class="insufficient-error">
                  {{ insufficientAError }}
                </div>
                Balance: {{ formatBalance(balanceFrom) }} {{ swapState.from.symbol }}
              </div>
            </div>
          </div>
          <q-input
            v-model="state.amountTokenA"
            :maxlength="14" outlined placeholder="0.0" class="swap-input"
            @update:model-value="(v) => {
              const val = String(v)
              if (val[val.length - 1] !== '.') {
                calcRate()
              }
            }"
            @keypress="onlyNumber"
          >
            <template #append>
              <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMaxAmount">
                MAX
              </q-btn>
              <select-token
                :options="tokens"
                :token="swapState.from"
                :swap-token="String(swapState.to.symbol)"
                @handle-search-token="handleSearchToken"
                @set-token="setToken"
              />
            </template>
          </q-input>
        </div>

        <div class="swap-field q-pt-xs">
          <div class="swap-field__info q-mt-sm">
            <div class="row items-end justify-end">
              <div class="col-8 col-xs-10 row justify-end swap-field__balance">
                <div v-if="insufficientBError" class="insufficient-error">
                  {{ insufficientBError }}
                </div>
                Balance: {{ formatBalance(balanceTo) }} {{ swapState.to.symbol }}
              </div>
            </div>
          </div>
          <q-input
            v-model="state.amountTokenB"
            :maxlength="14" outlined placeholder="0.0" class="swap-input"
            @update:model-value="(v) => {
              const val = String(v)
              if (val[val.length - 1] !== '.') {
                calcRate(true)
              }
            }"
            @keypress="onlyNumber"
          >
            <template #append>
              <select-token
                :swap-token="String(swapState.from.symbol)"
                :options="tokens"
                :direction="true"
                :token="swapState.to"
                :destination-unavailable="!tokenSwap"
                @handle-search-token="handleSearchToken"
                @set-token="setToken"
              />
            </template>
          </q-input>
        </div>
      </div>

      <div class="swap-info q-mt-md q-pt-xs">
        <dl>
          <dt>Max {{ swapState.from.symbol.toUpperCase() }} amount</dt>
          <dd>
            {{ formatBalance(state.maxAmountTokenA, swapState.from.decimals) }} {{ swapState.from.symbol.toUpperCase() }}
          </dd>
        </dl>
        <dl>
          <dt>Max {{ swapState.to.symbol.toUpperCase() }} amount</dt>
          <dd>
            {{ formatBalance(state.maxAmountTokenB, swapState.to.decimals) }} {{ swapState.to.symbol.toUpperCase() }}
          </dd>
        </dl>
        <dl>
          <dt>Pool tokens amount</dt>
          <dd>
            {{ lamportsToSol(state.poolAmount, 9) }}
          </dd>
        </dl>
        <dl>
          <dt>Slippage Tolerance</dt>
          <dd>
            <a href="#" @click="openSlippage">{{ formatPercent(state.slippage) }}</a>
          </dd>
        </dl>
      </div>

      <select-pool class="q-mt-md" />
      <policy-card class="q-mt-md q-mx-auto" />

      <div class="swap-submit q-mt-md">
        <q-btn :loading="state.swapping" :disable="!state.active || !tokenSwap || !state.amountTokenA" rounded :ripple="false" @click="depositBothTokens">
          Add Liquidity
        </q-btn>
      </div>

      <div v-if="!tokenSwap" class="text-weight-medium fs-13 text-center q-mt-md text-negative">
        Pool not found
      </div>
      <div v-else class="row q-mt-md text-center relative-position full-width">
        <div class="absolute-right swap-rate__refresh">
          <q-btn
            :loading="loadingPoolTokens"
            class="swap-card__reload"
            unelevated
            :color="$q.dark.isActive ? 'white' : 'primary'"
            round
            @click="loadPoolTokenAccounts"
          >
            <q-icon :name="evaRefresh" :color="$q.dark.isActive ? 'primary' : 'white'" />
          </q-btn>
        </div>
      </div>

      <div class="swap-info q-mt-md">
        <dl>
          <dt>Pool {{ swapState.from.symbol }} balance</dt>
          <dd>
            {{ formatBalance(poolBalanceA) }}
          </dd>
        </dl>
        <dl>
          <dt>Pool {{ swapState.to.symbol }} balance</dt>
          <dd>{{ formatBalance(poolBalanceB) }}</dd>
        </dl>
      </div>
    </q-card-section>

    <q-inner-loading :showing="swapState?.loading" class="swap-loading" color="grey" />
  </q-card>
  <q-dialog v-model="state.slippageDialog" transition-duration="100" transition-show="fade" transition-hide="fade">
    <q-card>
      <q-card-section>
        <q-btn-toggle
          v-model="state.slippage" spread no-caps unelevated :ripple="false" toggle-color="secondary"
          color="white" text-color="dark" :options="[
            { label: '0.1%', value: 0.001 },
            { label: '0.5%', value: 0.005 },
            { label: '1%', value: 0.01 },
            { label: '5%', value: 0.05 },
          ]" @update:model-value="closeSlippage"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
