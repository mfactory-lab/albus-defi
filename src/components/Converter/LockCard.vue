<script setup lang="ts">
import { useWallet } from 'solana-wallets-vue'
import { onlyNumber } from '@/utils'
import { type TokenData } from '@/config'

const { state } = useConverterStore()

const { connected } = useWallet()

function setToken(t: TokenData, direction: true) {
}

function setMaxAmount() {

}

const insufficientError = computed(() => {
  if (0 > 1) {
    return 'Insufficient funds'
  } else {
    return false
  }
})

/* watch([() => state.from.amount, tokenSwap, balanceFrom], (a) => {
  state.active = !insufficientError.value
}) */
</script>

<template>
  <q-card class="swap-card swap-widget">
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
                Balance: 0
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
              <!-- <select-token
                :options="tokens" :token="state.from" :swap-token="String(state.to.symbol)"
                @handle-search-token="handleSearchToken" @set-token="setToken"
              /> -->
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
                Balance: 0
              </div>
            </div>
          </div>
          <q-input v-model="state.to.amount" readonly :maxlength="14" outlined placeholder="0.0" class="swap-input">
            <template #append>
              <!-- <select-token
                :swap-token="String(state.from.symbol)" :options="tokens" :direction="true" :token="state.to" :destination-unavailable="!tokenSwap"
                @handle-search-token="handleSearchToken" @set-token="setToken"
              /> -->
            </template>
          </q-input>
        </div>
      </div>

      <div class="swap-info q-mt-md q-pt-xs">
        <dl class="text-weight-medium">
          <dt>Received</dt>
          <dd>
            1
          </dd>
        </dl>
        <dl>
          <dt>Swap fee</dt>
          <dd>1 SOL</dd>
        </dl>
      </div>

      <policy-card class="q-mt-md q-mx-auto" />

      <div class="swap-submit q-mt-md">
        <q-btn
          :loading="state.converting"
          :disable="!connected || !state.from.amount"
          rounded
          :ripple="false"
          @click="() => console.log('converting')"
        >
          Lock token
        </q-btn>
      </div>

      <div class="row q-mt-md text-center relative-position full-width">
        <div class="swap-rate q-mx-auto">
          1 token_a ≈ token_b
        </div>
      </div>
    </q-card-section>

    <q-inner-loading :showing="state?.loading" class="swap-loading" color="grey" />
  </q-card>
</template>
