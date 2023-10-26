<script setup lang="ts">
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from 'solana-wallets-vue'
import { formatBalance, formatPct, onlyNumber } from '@/utils'
import swapCircle from '@/assets/img/swap-circle.svg?raw'
import type { SwapData } from '@/stores/swap'

const { state, swapState, changeDirection, openSlippage, closeSlippage, setMax, changeValue, swapSubmit } = useSwap()
const { handleSearchToken, tokens } = useToken()

const { connected } = useWallet()

const filterTokens = computed(() => [...tokens.value].splice(-2))

function tokenBalance(symbol: string) {
  return swapState.userBalance[symbol] / LAMPORTS_PER_SOL
}

const formatPercent = (n: number) => formatPct.format(n)

const changeButtonRotate = ref(0)

const rotateBtnStyle = computed(() => `transform: rotate(${changeButtonRotate.value * 180}deg)`)

const symbolFrom = computed(() => state.from.label)
const symbolTo = computed(() => state.to.label)
const balanceFrom = computed(() => tokenBalance(symbolFrom.value))
const balanceTo = computed(() => tokenBalance(symbolTo.value))

const swapFee = computed(() => state.fees.host + state.fees.trade)

function handleChangeDirection() {
  changeDirection()
  changeButtonRotate.value++
}

function setToken(t: SwapData, direction: true) {
  state[direction ? 'to' : 'from'] = t
}

function setMaxAmount() {
  setMax(balanceFrom.value)
}

const insufficientError = computed(() => {
  const insufficient = Number(state.from.amount) > balanceFrom.value
  const minimum = Number(state.from.amount) < 1
  if (insufficient) {
    return 'Insufficient funds'
  } else if (minimum) {
    return 'Minimum Received 1'
  } else {
    return false
  }
})

watch(() => state.from.amount, (a) => {
  state.active = Number(a) >= 1 && !insufficientError.value
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
                Balance: {{ formatBalance(balanceFrom) }} {{ symbolFrom }}
              </div>
            </div>
          </div>
          <q-input
            v-model="state.from.amount" :maxlength="14" outlined placeholder="0.0" class="swap-input" :disable="!connected"
            @keypress="onlyNumber" @keyup="changeValue"
          >
            <template #append>
              <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMaxAmount">
                MAX
              </q-btn>
              <select-token
                :options="filterTokens" :token="state.from" :swap-token="String(state.to.value)"
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
                Balance: {{ formatBalance(balanceTo) }} {{ symbolTo }}
              </div>
            </div>
          </div>
          <q-input v-model="state.to.amount" :disable="!connected" readonly :maxlength="14" outlined placeholder="0.0" class="swap-input">
            <template #append>
              <select-token
                :swap-token="String(state.from.value)" :options="filterTokens" :direction="true" :token="state.to"
                @handle-search-token="handleSearchToken" @set-token="setToken"
              />
            </template>
          </q-input>
        </div>
      </div>

      <div class="swap-info">
        <dl>
          <dt>Minimum Received::</dt>
          <dd>
            1 {{ symbolFrom.toUpperCase() }}
          </dd>
        </dl>
        <dl>
          <dt>Slippage Tolerance:</dt>
          <dd>
            <a href="#" @click="openSlippage">{{ formatPercent(state.slippage) }}</a>
          </dd>
        </dl>
        <dl>
          <dt>Swap fee:</dt>
          <dd>{{ formatPercent(swapFee) }} SOL</dd>
        </dl>
      </div>

      <div class="swap-submit">
        <q-btn :loading="state.swapping" :disable="!state.active" rounded :ripple="false" @click="swapSubmit">
          Swap {{ state.from.label }} / {{ state.to.label }}
        </q-btn>
      </div>

      <div class="swap-rate">
        1 JPLT ≈ <!-- {{ rate }} -->0 JPLU
      </div>
    </q-card-section>

    <q-inner-loading :showing="swapState.loading" class="swap-loading" color="grey" />
  </q-card>
  <q-dialog v-model="swapState.slippageDialog" transition-duration="100" transition-show="fade" transition-hide="fade">
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

  <zkp-request-dialog />
</template>
