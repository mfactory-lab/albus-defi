<script setup lang="ts">
import { evaRefresh } from '@quasar/extras/eva-icons'
import { formatBalance, lamportsToSol, onlyNumber } from '@/utils'
import swapCircle from '@/assets/img/swap-circle.svg?raw'
import { SOL_MINT, type TokenData } from '@/config'

const swapStore = useSwapStore()
const { state: swapState, loadingPoolTokens, changeDirection, setMax, loadPoolTokenAccounts } = swapStore
const tokenSwap = computed(() => swapStore.tokenSwap)

const liquiditySingleStore = useLiquiditySingleStore()
const { state, depositSingleToken } = liquiditySingleStore

const { handleSearchToken, handleFilterToken, tokens } = useToken()
handleFilterToken(SOL_MINT)

const userStore = useUserStore()
const poolBalanceA = computed(() => swapState.poolBalance[swapState.from.mint] ? lamportsToSol(swapState.poolBalance[swapState.from.mint], swapState.from.decimals) : 0)
const poolBalanceB = computed(() => swapState.poolBalance[swapState.to.mint] ? lamportsToSol(swapState.poolBalance[swapState.to.mint], swapState.to.decimals) : 0)

const changeButtonRotate = ref(0)

const rotateBtnStyle = computed(() => `transform: rotate(${changeButtonRotate.value * 180}deg)`)

const balanceFrom = computed(() => userStore.tokenBalance(swapState.from.mint))
const balanceTo = computed(() => userStore.tokenBalance(swapState.to.mint))

function handleChangeDirection() {
  changeDirection()
  changeButtonRotate.value++
}

function setToken(t: TokenData, direction: true) {
  swapState[direction ? 'to' : 'from'] = t
}

function setMaxAmount() {
  setMax(balanceFrom.value)
}

const insufficientError = computed(() => {
  if (Number(state.amountTokenA) > balanceFrom.value) {
    return 'Insufficient funds'
  } else {
    return false
  }
})

watch([() => state.amountTokenA, tokenSwap, balanceFrom], (_a) => {
  state.active = !insufficientError.value
})
</script>

<template>
  <q-card class="swap-card swap-widget">
    <q-card-section class="swap-card__header">
      Deposit
    </q-card-section>

    <q-card-section class="swap-card__body">
      <div class="swap-form">
        <div class="swap-field">
          <div class="swap-field__info">
            <div class="row items-end">
              <div class="col swap-field__label" />
              <div class="col-8 col-xs-10 row justify-end swap-field__balance">
                <div v-if="insufficientError" class="insufficient-error">
                  {{ insufficientError }}
                </div>
                Balance: {{ formatBalance(balanceFrom) }} {{ swapState.from.symbol }}
              </div>
            </div>
          </div>
          <q-input
            v-model="state.amountTokenA" :maxlength="14" outlined placeholder="0.0" class="swap-input"
            @keypress="onlyNumber"
          >
            <template #append>
              <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMaxAmount">
                MAX
              </q-btn>
              <select-token
                :options="tokens" :token="swapState.from" :swap-token="String(swapState.to.symbol)"
                @handle-search-token="handleSearchToken" @set-token="setToken"
              />
            </template>
          </q-input>
        </div>

        <div class="swap-change">
          <q-btn :ripple="false" dense unelevated :style="rotateBtnStyle" @click="handleChangeDirection">
            <i v-html="swapCircle" />
          </q-btn>
        </div>

        <div class="swap-field">
          <div class="swap-field__info q-mt-sm">
            <div class="row">
              <div class="col swap-field__balance">
                Balance: {{ formatBalance(balanceTo) }} {{ swapState.to.symbol }}
              </div>
            </div>
          </div>
          <q-input v-model="undefined" readonly outlined class="swap-input">
            <template #append>
              <select-token
                :swap-token="String(swapState.from.symbol)" :options="tokens" :direction="true" :token="swapState.to" :destination-unavailable="!tokenSwap"
                @handle-search-token="handleSearchToken" @set-token="setToken"
              />
            </template>
          </q-input>
        </div>
      </div>

      <select-pool class="q-mt-md" />

      <div class="swap-submit q-mt-lg">
        <q-btn :loading="state.swapping" :disable="!state.active || !tokenSwap || !state.amountTokenA" rounded :ripple="false" @click="depositSingleToken">
          Add Liquidity ({{ swapState.from.symbol }})
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

      <div class="swap-info q-mt-lg">
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
</template>
