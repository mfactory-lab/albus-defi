<script setup lang="ts">
import { Notify } from 'quasar'
import { formatBalance, onlyNumber } from '@/utils'

const { state, setMax, transferSOL, setToken } = useTransferStore()
const { state: userState } = useUserStore()
const { handleSearchToken, options, tokenBalance } = useToken()

const balance = computed(() => tokenBalance(state.token.label))

const emptyBalance = computed(() => balance.value === 0)

async function transferSubmit() {
  if (!state.valid) {
    return Notify.create({
      type: 'negative',
      timeout: 2000,
      message: 'Not valid address',
    })
  }
  transferSOL()
}

const active = computed(() => Number(state.value) > 0 && state.address.length >= 44)

watch(() => state.value, (a) => {
  if (Number(a) > balance.value) {
    state.value = balance.value
    Notify.create({
      type: 'warning',
      timeout: 1500,
      message: 'Insufficient funds!',
    })
  }
})
</script>

<template>
  <q-card class="swap-card">
    <q-card-section class="swap-card__header">
      Transfer
    </q-card-section>

    <q-card-section class="swap-card__body">
      <div class="swap-form">
        <div class="swap-field">
          <div class="swap-field__info">
            <div class="row items-end">
              <div class="col-3 swap-field__label">
                FROM:
              </div>
              <div class="col-2 swap-field__label">
                AMOUNT
              </div>
              <div class="col swap-field__balance">
                Balance: {{ formatBalance(balance) }}
              </div>
            </div>
          </div>
          <div class="row justify-between" style="gap: 10px">
            <select-token :options="options" @handle-search-token="handleSearchToken" @set-token="setToken" />

            <q-input
              v-model="state.value" :maxlength="14" outlined placeholder="0.0" class="swap-input col"
              :disable="emptyBalance" @keypress="onlyNumber"
            >
              <!-- @keyup="changeValue" -->
              <template #append>
                <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMax(balance)">
                  MAX
                </q-btn>
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div class="transfer-address">
        <div class="col transfer-address__label">
          Address
        </div>
        <q-input v-model="state.address" :disable="emptyBalance" :maxlength="50" outlined class="swap-input col" />
      </div>

      <div class="swap-info">
        <dl>
          <dt>Transfer fee:</dt>
          <dd>{{ state.fee }}</dd>
        </dl>
      </div>

      <div class="swap-submit transfer-submit">
        <q-btn :loading="state.loading" :disable="!active" rounded :ripple="false" @click="transferSubmit">
          Send
        </q-btn>
      </div>
    </q-card-section>

    <q-inner-loading :showing="userState.loading" class="swap-loading" color="grey" />
  </q-card>
</template>
