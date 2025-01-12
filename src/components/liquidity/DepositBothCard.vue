<script setup lang="ts">
import { evaRefresh } from '@quasar/extras/eva-icons'
import { formatBalance, formatPct, lamportsToSol, onlyNumber } from '@/utils'
import { LP_DECIMALS, MIN_FEE, RENT_FEE, SOL_MINT, TRANSFER_FEE_CONST, type TokenData, WRAPPED_SOL_MINT } from '@/config'

const swapStore = useSwapStore()
const { state: swapState, loadingPoolTokens, loadPoolTokenAccounts } = swapStore
const tokenSwap = computed(() => swapStore.tokenSwap)
const lpBalance = computed(() => (tokenSwap.value && swapStore.userPoolsTokens[tokenSwap.value.data.poolMint.toBase58()]) || 0)

const liquidityStore = useLiquidityStore()
const { state, depositBothTokens, calcRate, closeSlippage } = liquidityStore

const { certificateExpired } = useCertificate()

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

function setMaxAmount(to = false) {
  const tokenField = to ? 'to' : 'from'
  const tokenAmount = to ? 'amountTokenB' : 'amountTokenA'
  const balance = to ? balanceTo.value : balanceFrom.value
  if (swapState[tokenField]?.mint === SOL_MINT || swapState[tokenField]?.mint === WRAPPED_SOL_MINT) {
    state[tokenAmount] = balance - RENT_FEE - 3 * MIN_FEE - TRANSFER_FEE_CONST
  } else {
    state[tokenAmount] = balance
  }
  calcRate(to)
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
          v-model="state.amountTokenA" :maxlength="14" outlined placeholder="0.0" class="swap-input"
          @update:model-value="(v) => {
            const val = String(v)
            if (val[val.length - 1] !== '.') {
              calcRate()
            }
          }" @keypress="onlyNumber"
        >
          <template #append>
            <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMaxAmount()">
              MAX
            </q-btn>
            <select-token
              :options="tokens" :token="swapState.from" :swap-token="String(swapState.to.symbol)"
              @handle-search-token="handleSearchToken" @set-token="setToken"
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
          v-model="state.amountTokenB" :maxlength="14" outlined placeholder="0.0" class="swap-input"
          @update:model-value="(v) => {
            const val = String(v)
            if (val[val.length - 1] !== '.') {
              calcRate(true)
            }
          }" @keypress="onlyNumber"
        >
          <template #append>
            <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMaxAmount(true)">
              MAX
            </q-btn>
            <select-token
              :swap-token="String(swapState.from.symbol)" :options="tokens" :direction="true"
              :token="swapState.to" :destination-unavailable="!tokenSwap" @handle-search-token="handleSearchToken"
              @set-token="setToken"
            />
          </template>
        </q-input>
      </div>
    </div>

    <div class="swap-info q-mt-md q-pt-xs">
      <dl class="text-weight-medium">
        <dt>LP tokens received</dt>
        <dd>
          {{ lamportsToSol(state.poolAmount, LP_DECIMALS) }}
        </dd>
      </dl>
      <dl class="text-weight-medium">
        <dt>Max {{ swapState.from.symbol.toUpperCase() }} to be withdrawn</dt>
        <dd>
          {{ formatBalance(state.maxAmountTokenA, swapState.from.decimals) }} {{ swapState.from.symbol.toUpperCase() }}
        </dd>
      </dl>
      <dl class="text-weight-medium">
        <dt>Max {{ swapState.to.symbol.toUpperCase() }} to be withdrawn</dt>
        <dd>
          {{ formatBalance(state.maxAmountTokenB, swapState.to.decimals) }} {{ swapState.to.symbol.toUpperCase() }}
        </dd>
      </dl>
      <dl>
        <dt>Slippage Tolerance</dt>
        <dd>
          <a href="#">
            {{ formatPercent(state.slippage) }}
            <q-menu
              v-model="state.slippageDialog" transition-duration="100" transition-show="fade"
              transition-hide="fade"
            >
              <q-card>
                <q-card-section>
                  <q-btn-toggle
                    v-model="state.slippage" spread no-caps unelevated :ripple="false"
                    toggle-color="secondary" color="white" text-color="dark" :options="[
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
    </div>

    <select-pool class="q-mt-md" />
    <policy-card class="q-mt-md q-mx-auto" />

    <div class="swap-submit q-mt-md">
      <q-btn
        :loading="state.swapping"
        :disable="!state.active || !tokenSwap || !state.amountTokenA || certificateExpired" rounded
        :ripple="false" @click="depositBothTokens"
      >
        Add Liquidity
      </q-btn>
    </div>

    <div v-if="!tokenSwap" class="text-weight-medium fs-13 text-center q-mt-md text-negative">
      Pool not found
    </div>
    <div v-else class="row q-mt-md text-center relative-position full-width">
      <div class="absolute-right swap-rate__refresh">
        <q-btn
          :loading="loadingPoolTokens" class="swap-card__reload" unelevated
          :color="$q.dark.isActive ? 'white' : 'primary'" round @click="loadPoolTokenAccounts"
        >
          <q-icon :name="evaRefresh" :color="$q.dark.isActive ? 'primary' : 'white'" />
        </q-btn>
      </div>
    </div>

    <div class="swap-info q-mt-lg q-pt-sm">
      <dl>
        <dt>Your LP tokens</dt>
        <dd>
          {{ lamportsToSol(lpBalance, LP_DECIMALS) }}
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
