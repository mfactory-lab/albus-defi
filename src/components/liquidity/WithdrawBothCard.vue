<script setup lang="ts">
import { formatBalance, formatPct, lamportsToSol, onlyNumber, solToLamports } from '@/utils'
import { LP_DECIMALS } from '@/config'

const swapStore = useSwapStore()
const { state: swapState } = swapStore
const tokenSwap = computed(() => swapStore.tokenSwap)

const liquidityWithdrawStore = useLiquidityWithdrawStore()
const { state, depositBothTokens, openSlippage, closeSlippage } = liquidityWithdrawStore

const balance = computed(() => (tokenSwap.value && swapStore.userPoolsTokens[tokenSwap.value.data.poolMint.toBase58()]) || 0)

const formatPercent = (n: number) => formatPct.format(n)

function setMaxAmount() {
  state.poolAmount = lamportsToSol(balance.value, LP_DECIMALS)
}

const insufficientError = computed(() => {
  if (Number(solToLamports(state.poolAmount, LP_DECIMALS)) > balance.value) {
    return 'Insufficient funds'
  } else {
    return false
  }
})

// TODO: refactory in all components
watch([() => state.poolAmount, balance], () => {
  state.active = !insufficientError.value
})
</script>

<template>
  <q-card v-if="tokenSwap" class="swap-card swap-widget">
    <q-card-section class="swap-card__header">
      Withdraw
    </q-card-section>

    <q-card-section class="swap-card__body">
      <div class="swap-form">
        <div class="swap-field">
          <div class="swap-field__info">
            <div class="row">
              <div class="col-2 swap-field__label">
                AMOUNT
              </div>
              <div class="col row justify-end swap-field__balance q-pr-sm">
                <div v-if="insufficientError" class="insufficient-error">
                  Insufficient funds
                </div>
                Balance: {{ formatBalance(lamportsToSol(balance, LP_DECIMALS)) }}
              </div>
            </div>
          </div>
          <div class="row justify-between" style="gap: 10px">
            <q-input
              v-model="state.poolAmount" :maxlength="14" outlined placeholder="0.0"
              class="swap-input col" @keypress="onlyNumber"
            >
              <template #append>
                <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMaxAmount">
                  MAX
                </q-btn>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="swap-info q-mt-md q-pt-xs">
        <dl>
          <dt>Min {{ swapState.from.symbol.toUpperCase() }} amount</dt>
          <dd>
            {{ formatBalance(lamportsToSol(state.minAmountTokenA, swapState.from.decimals), swapState.from.decimals) }} {{ swapState.from.symbol.toUpperCase() }}
          </dd>
        </dl>
        <dl>
          <dt>Min {{ swapState.to.symbol.toUpperCase() }} amount</dt>
          <dd>
            {{ formatBalance(lamportsToSol(state.minAmountTokenB, swapState.to.decimals), swapState.to.decimals) }} {{ swapState.to.symbol.toUpperCase() }}
          </dd>
        </dl>
        <dl>
          <dt>LP tokens total</dt>
          <dd>
            {{ lamportsToSol(swapState.poolTokenSupply, LP_DECIMALS) }}
          </dd>
        </dl>
        <dl>
          <dt>Slippage Tolerance</dt>
          <dd>
            <a href="#" @click="openSlippage">{{ formatPercent(state.slippage) }}</a>
          </dd>
        </dl>
      </div>

      <div class="swap-submit q-mt-md">
        <q-btn :loading="state.swapping" :disable="!state.active || !tokenSwap || !state.poolAmount" rounded :ripple="false" @click="depositBothTokens">
          Remove Liquidity
        </q-btn>
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
