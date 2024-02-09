<script setup lang="ts">
import { useAnchorWallet } from 'solana-wallets-vue'
import { convertTokenIcon, formatBalance, onlyNumber } from '@/utils'

const { state } = useConverterStore()
const {
  options,
  setToken,
  handleSearchToken,
  pairRatio,
  pairLockedAmount,
  pairLockFee,
  tokenASymbol,
  tokenBSymbol,
  isHaveCertificate,
  lockUnlockToken,
} = useConverter()

state.isLock = true

const wallet = useAnchorWallet()

const balanceFrom = computed(() => state.from.balance)
const balanceTo = computed(() => state.to.balance)

const tokenReceived = computed(() => state.to.amount)

function setMaxAmount() {
  state.from.amount = balanceFrom.value
}

async function handleLock() {
  await lockUnlockToken()
}

const insufficientError = computed(() => {
  if (state.from.amount > balanceFrom.value) {
    return 'Insufficient funds'
  } else {
    return false
  }
})
</script>

<template>
  <q-card class="swap-card swap-widget converting-card">
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
                Balance: {{ formatBalance(balanceFrom) }}
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
                v-if="state.token" :options="options" :token="state.token"
                :swap-token="String(state.to.symbol)" @handle-search-token="handleSearchToken" @set-token="setToken"
              />
            </template>
          </q-input>
        </div>
        <div class="swap-change" />
        <div class="swap-field">
          <div class="swap-field__info">
            <div class="row">
              <div class="col swap-field__label">
                TO:
              </div>
              <div class="col swap-field__balance">
                Balance: {{ formatBalance(balanceTo) }}
              </div>
            </div>
          </div>
          <q-input v-model="state.to.amount" readonly :maxlength="14" outlined placeholder="0.0" class="swap-input">
            <template v-if="state.to?.symbol" #append>
              <div class="convert-to">
                <img :src="convertTokenIcon(state.to?.image)"> <span>{{ state.to?.symbol }}</span>
              </div>
            </template>
          </q-input>
        </div>
      </div>

      <div class="swap-info q-mt-md q-pt-xs">
        <dl>
          <dt>Received</dt>
          <dd>
            {{ tokenReceived }} {{ tokenBSymbol }}
          </dd>
        </dl>
        <dl>
          <dt>Locked amount</dt>
          <dd>{{ pairLockedAmount }} {{ tokenASymbol }}</dd>
        </dl>
        <dl>
          <dt>Ratio</dt>
          <dd v-if="pairRatio">
            1:{{ pairRatio }}
          </dd>
          <dd v-else>
            -
          </dd>
        </dl>
        <dl>
          <dt>Lock fee</dt>
          <dd>{{ pairLockFee }} SOL</dd>
        </dl>
      </div>
      <policy-card class="q-mt-md q-mx-auto" />

      <div class="swap-submit q-mt-md">
        <q-btn
          :loading="state.converting" rounded :ripple="false"
          :disable="!wallet?.publicKey || !state.from.amount || state.from.amount <= 0 || !!insufficientError || !isHaveCertificate"
          @click="handleLock"
        >
          Lock token
        </q-btn>
      </div>

      <div class="row q-mt-md text-center relative-position full-width">
        <div class="swap-rate q-mx-auto">
          1 {{ tokenASymbol }} = {{ pairRatio }} {{ tokenBSymbol }}
        </div>
      </div>
    </q-card-section>

    <q-inner-loading :showing="state?.loading" class="swap-loading" color="grey" />
  </q-card>
</template>
