<script setup lang="ts">
import { evaRefresh } from '@quasar/extras/eva-icons'
import { formatBalance, formatPct, lamportsToSol, onlyNumber, solToLamports } from '@/utils'
import { LP_DECIMALS } from '@/config'

const swapStore = useSwapStore()
const { state: swapState, loadingPoolTokens, loadPoolTokenAccounts } = swapStore
const tokenSwap = computed(() => swapStore.tokenSwap)

const liquidityWithdrawStore = useLiquidityWithdrawStore()
const { state, depositBothTokens, closeSlippage } = liquidityWithdrawStore

const balance = computed(() => (tokenSwap.value && swapStore.userPoolsTokens[tokenSwap.value.data.poolMint.toBase58()]) || 0)
const poolBalanceA = computed(() => swapState.poolBalance[swapState.from.mint] ? lamportsToSol(swapState.poolBalance[swapState.from.mint], swapState.from.decimals) : 0)
const poolBalanceB = computed(() => swapState.poolBalance[swapState.to.mint] ? lamportsToSol(swapState.poolBalance[swapState.to.mint], swapState.to.decimals) : 0)

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
  <q-card-section class="swap-card__body">
    <select-pair />
    <div class="swap-form q-mt-md">
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
      <dl class="text-weight-medium">
        <dt>Min {{ swapState.from.symbol.toUpperCase() }} received</dt>
        <dd>
          {{ formatBalance(lamportsToSol(state.minAmountTokenA, swapState.from.decimals), swapState.from.decimals) }} {{ swapState.from.symbol.toUpperCase() }}
        </dd>
      </dl>
      <dl class="text-weight-medium">
        <dt>Min {{ swapState.to.symbol.toUpperCase() }} received</dt>
        <dd>
          {{ formatBalance(lamportsToSol(state.minAmountTokenB, swapState.to.decimals), swapState.to.decimals) }} {{ swapState.to.symbol.toUpperCase() }}
        </dd>
      </dl>
      <dl>
        <dt>Slippage Tolerance</dt>
        <dd>
          <a href="#">
            {{ formatPercent(state.slippage) }}
            <q-menu v-model="state.slippageDialog" transition-duration="100" transition-show="fade" transition-hide="fade">
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
            </q-menu>
          </a>
        </dd>
      </dl>
      <dl>
        <dt>Withdraw fee</dt>
        <dd>{{ formatPercent(swapState.fees.ownerWithdraw) }} SOL</dd>
      </dl>
    </div>

    <select-pool class="q-mt-md" />
    <policy-card class="q-mt-md q-mx-auto" />

    <div class="swap-submit q-mt-md">
      <q-btn :loading="state.swapping" :disable="!state.active || !tokenSwap || !state.poolAmount" rounded :ripple="false" @click="depositBothTokens">
        Remove Liquidity
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

    <div class="swap-info q-mt-lg q-pt-sm">
      <dl>
        <dt>LP tokens total</dt>
        <dd>
          {{ lamportsToSol(swapState.poolTokenSupply, LP_DECIMALS) }}
        </dd>
      </dl>
      <dl>
        <dt>Pool {{ swapState.from.symbol }} balance</dt>
        <dd>{{ formatBalance(poolBalanceA) }} {{ swapState.from.symbol }}</dd>
      </dl>
      <dl>
        <dt>Pool {{ swapState.to.symbol }} balance</dt>
        <dd>{{ formatBalance(poolBalanceB) }} {{ swapState.to.symbol }}</dd>
      </dl>
    </div>

    <q-inner-loading :showing="swapState?.loading" class="swap-loading" color="grey" />
  </q-card-section>
</template>
