<script setup lang="ts">
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from 'solana-wallets-vue'
import { formatBalance, formatPct, lamportsToSol, onlyNumber } from '@/utils'
import swapCircle from '@/assets/img/swap-circle.svg?raw'
import type { TokenData } from '@/config'

const { state, swapState, minimumReceived, changeDirection, openSlippage, closeSlippage, setMax, swapSubmit } = useSwap()
const { handleSearchToken, tokens } = useToken()
const swapStore = useSwapStore()
const userStore = useUserStore()
const poolBalanceA = computed(() => swapStore.state.poolBalance[state.from.mint] ? lamportsToSol(swapStore.state.poolBalance[state.from.mint], state.from.decimals) : 0)
const poolBalanceB = computed(() => swapStore.state.poolBalance[state.to.mint] ? lamportsToSol(swapStore.state.poolBalance[state.to.mint], state.to.decimals) : 0)

const { connected } = useWallet()

const formatPercent = (n: number) => formatPct.format(n)

const changeButtonRotate = ref(0)

const rotateBtnStyle = computed(() => `transform: rotate(${changeButtonRotate.value * 180}deg)`)

const symbolFrom = computed(() => state.from.name)
const symbolTo = computed(() => state.to.name)
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
  setMax(balanceFrom.value)
}

const insufficientError = computed(() => {
  if (Number(state.from.amount) > balanceFrom.value) {
    return 'Insufficient funds'
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
                Balance: {{ formatBalance(balanceTo) }} {{ symbolTo }}
              </div>
            </div>
          </div>
          <q-input v-model="state.to.amount" :disable="!connected" readonly :maxlength="14" outlined placeholder="0.0" class="swap-input">
            <template #append>
              <select-token
                :swap-token="String(state.from.symbol)" :options="tokens" :direction="true" :token="state.to"
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
            {{ formatBalance(minimumReceived / LAMPORTS_PER_SOL) }} {{ symbolFrom.toUpperCase() }}
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
        <q-btn :loading="state.swapping" rounded :ripple="false" @click="swapSubmit">
          Swap {{ state.from.name }} / {{ state.to.name }}
        </q-btn>
      </div>

      <div class="swap-rate q-mt-md">
        1 {{ state.from.name }} ≈ {{ formatBalance(state.rate) }} {{ state.to.name }}
      </div>
      <div class="swap-rate">
        Price impact: {{ formatPercent(state.impact) }}
      </div>

      <div class="q-mt-lg">
        DEBUG:
      </div>
      <div>
        Pool {{ state.from.symbol }} balance: {{ formatBalance(poolBalanceA) }}
      </div>
      <div>
        Pool {{ state.to.symbol }} balance: {{ formatBalance(poolBalanceB) }}
      </div>
    </q-card-section>

    <q-inner-loading :showing="swapState?.loading" class="swap-loading" color="grey" />
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
</template>
