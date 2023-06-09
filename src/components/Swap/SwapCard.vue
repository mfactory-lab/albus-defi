<script setup lang="ts">
import { formatBalance, onlyNumber } from '@/utils'
import swapCircle from '@/assets/img/swap-circle.svg?raw'
import type { SwapData } from '@/stores/swap'

const { state, changeDirection, openSlippage, closeSlippage } = useSwapStore()
const { handleSearchToken, options, tokenBalance } = useToken()

const changeButtonRotate = ref(0)

const rotateBtnStyle = computed(() => `transform: rotate(${changeButtonRotate.value * 180}deg)`)

const balanceFrom = computed(() => formatBalance(tokenBalance(state.from.label)))
const balanceTo = computed(() => formatBalance(tokenBalance(state.to.label)))

function handleChangeDirection() {
  changeDirection()
  changeButtonRotate.value++
}

function setToken(t: SwapData, direction: true) {
  state[direction ? 'to' : 'from'] = t
}

function setMax(from: any) {
  console.log(from)
}

function swapSubmit() {
  console.log('swapSubmit')
}
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
              <div class="col swap-field__balance">
                Balance: {{ balanceFrom }}
              </div>
            </div>
          </div>
          <q-input
            v-model="state.from.amount" :maxlength="14" outlined placeholder="0.0" class="swap-input"
            @keypress="onlyNumber"
          >
            <template #append>
              <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMax(state.from)">
                MAX
              </q-btn>
              <select-token
                :options="options" :token="state.from" :swap-token="state.to.value"
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
                Balance: {{ balanceTo }}
              </div>
            </div>
          </div>
          <q-input v-model="state.to.amount" readonly :maxlength="14" outlined placeholder="0.0" class="swap-input">
            <template #append>
              <select-token
                :swap-token="state.from.value"
                :options="options" :direction="true" :token="state.to"
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
            <!-- {{ formatPercent(state.priceImpact) }} -->1 SOL
          </dd>
        </dl>
        <dl>
          <dt>Slippage Tolerance:</dt>
          <dd>
            <a href="#" @click="openSlippage"><!-- {{ formatPercent(state.slippage) }} -->0 SOL</a>
          </dd>
        </dl>
        <dl>
          <dt>Swap fee:</dt>
          <dd><!-- {{ formatPercent(state.fees.trade) }} -->1 SOL</dd>
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

    <q-inner-loading :showing="state.loading" class="swap-loading" color="grey" />
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
