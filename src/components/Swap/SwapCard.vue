<script setup lang="ts">
import { evaRefresh } from '@quasar/extras/eva-icons'
import { useWallet } from 'solana-wallets-vue'
import { formatBalance, formatPct, lamportsToSol, onlyNumber } from '@/utils'
import swapCircle from '@/assets/img/swap-circle.svg?raw'
import { MIN_FEE, RENT_FEE, SOL_MINT, TRANSFER_FEE_CONST, type TokenData, WRAPPED_SOL_MINT } from '@/config'

const swapStore = useSwapStore()
const { state, loadingPoolTokens, changeDirection, openSlippage, closeSlippage, swapSubmit, loadPoolTokenAccounts } = swapStore
const tokenSwap = computed(() => swapStore.tokenSwap)
const { handleSearchToken, handleFilterToken, tokens } = useToken()
handleFilterToken(SOL_MINT)

const userStore = useUserStore()
const poolBalanceA = computed(() => state.poolBalance[state.from.mint] ? lamportsToSol(state.poolBalance[state.from.mint], state.from.decimals) : 0)
const poolBalanceB = computed(() => state.poolBalance[state.to.mint] ? lamportsToSol(state.poolBalance[state.to.mint], state.to.decimals) : 0)

const { connected } = useWallet()

const formatPercent = (n: number) => formatPct.format(n)

const changeButtonRotate = ref(0)

const rotateBtnStyle = computed(() => `transform: rotate(${changeButtonRotate.value * 180}deg)`)

const balanceFrom = computed(() => userStore.tokenBalance(state.from.mint))
const balanceTo = computed(() => userStore.tokenBalance(state.to.mint))
const swapFee = computed(() => state.fees.ownerTrade + state.fees.trade)

function handleChangeDirection() {
  changeDirection()
  changeButtonRotate.value++
}

function setToken(t: TokenData, direction: true) {
  state[direction ? 'to' : 'from'] = t
}

function setMaxAmount() {
  if (state.from?.mint === SOL_MINT || state.from?.mint === WRAPPED_SOL_MINT) {
    state.from.amount = balanceFrom.value - RENT_FEE - 3 * MIN_FEE - TRANSFER_FEE_CONST
  } else {
    state.from.amount = balanceFrom.value
  }
}

const insufficientError = computed(() => {
  if (Number(state.from.amount) > balanceFrom.value) {
    return 'Insufficient funds'
  } else {
    return false
  }
})

watch([() => state.from.amount, tokenSwap, balanceFrom], (a) => {
  state.active = !insufficientError.value
})
</script>

<template>
  <q-card class="swap-card swap-widget">
    <q-card-section class="swap-card__header">
      Swap
    </q-card-section>

    <q-card-section class="swap-card__body">
      <div class="swap-form">
        <div class="swap-field">
          <div class="swap-field__info">
            <div class="row items-end">
              <div class="col swap-field__label">
                FROM:
              </div>
              <div class="col-8 col-xs-10 row justify-end swap-field__balance">
                <div v-if="insufficientError" class="insufficient-error">
                  {{ insufficientError }}
                </div>
                Balance: {{ formatBalance(balanceFrom) }} {{ state.from.symbol }}
              </div>
            </div>
          </div>
          <q-input
            v-model="state.from.amount" :maxlength="14" outlined placeholder="0.0" class="swap-input"
            @keypress="onlyNumber"
          >
            <template #append>
              <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMaxAmount">
                MAX
              </q-btn>
              <select-token
                :options="tokens" :token="state.from" :swap-token="String(state.to.symbol)"
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
          <div class="swap-field__info">
            <div class="row">
              <div class="col swap-field__label">
                TO:
              </div>
              <div class="col swap-field__balance">
                Balance: {{ formatBalance(balanceTo) }} {{ state.to.symbol }}
              </div>
            </div>
          </div>
          <q-input v-model="state.to.amount" readonly :maxlength="14" outlined placeholder="0.0" class="swap-input">
            <template #append>
              <select-token
                :swap-token="String(state.from.symbol)" :options="tokens" :direction="true" :token="state.to" :destination-unavailable="!tokenSwap"
                @handle-search-token="handleSearchToken" @set-token="setToken"
              />
            </template>
          </q-input>
        </div>
      </div>

      <div class="swap-info q-mt-md q-pt-xs">
        <dl class="text-weight-medium">
          <dt>Minimum Received</dt>
          <dd>
            {{ formatBalance(lamportsToSol(state.minimumReceived, state.to.decimals)) }} {{ state.to.symbol.toUpperCase() }}
          </dd>
        </dl>
        <dl>
          <dt>Slippage Tolerance</dt>
          <dd>
            <a href="#" @click="openSlippage">{{ formatPercent(state.slippage) }}</a>
          </dd>
        </dl>
        <dl>
          <dt>Swap fee</dt>
          <dd>{{ formatPercent(swapFee) }} SOL</dd>
        </dl>
      </div>

      <select-pool class="q-mt-md" />
      <policy-card class="q-mt-md q-mx-auto" />

      <div class="swap-submit q-mt-md">
        <q-btn
          :loading="state.swapping"
          :disable="!state.active || !tokenSwap || !connected || !state.from.amount"
          rounded
          :ripple="false"
          @click="swapSubmit"
        >
          Swap {{ state.from.symbol }} / {{ state.to.symbol }}
        </q-btn>
      </div>

      <div v-if="!tokenSwap" class="text-weight-medium fs-13 text-center q-mt-md text-negative">
        Pool not found
      </div>
      <div v-else class="row q-mt-md text-center relative-position full-width">
        <div class="swap-rate q-mx-auto">
          1 {{ state.from.symbol }} ≈ {{ formatBalance(state.rate) }} {{ state.to.symbol }}
        </div>
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
          <dt>Price impact</dt>
          <dd>
            {{ formatPercent(state.impact) }}
          </dd>
        </dl>
        <dl>
          <dt>Pool {{ state.from.symbol }} balance</dt>
          <dd>{{ formatBalance(poolBalanceA) }} {{ state.from.symbol }}</dd>
        </dl>
        <dl>
          <dt>Pool {{ state.to.symbol }} balance</dt>
          <dd>{{ formatBalance(poolBalanceB) }} {{ state.to.symbol }}</dd>
        </dl>
      </div>
    </q-card-section>

    <q-inner-loading :showing="state?.loading" class="swap-loading" color="grey" />
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
