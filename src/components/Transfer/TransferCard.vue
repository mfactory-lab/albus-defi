<script setup lang="ts">
import { Notify } from 'quasar'
import { useWallet } from 'solana-wallets-vue'
import { lowerCase } from 'lodash-es'
import { formatBalance, onlyNumber, validateAddress } from '@/utils'
import { MIN_FEE, RENT_FEE, TRANSFER_FEE_CONST } from '@/config/common'

const { state, setMax, setToken, verifyTransfer } = useTransferStore()
const { state: userState, tokenBalance } = useUserStore()
const { tokens } = useToken()

const filterTokenExist = computed(() => {
  const tokensFiltered = tokens.value.filter(token => userState.tokens.find(t => token.name === lowerCase(t.symbol)))
  // return tokens.length !== 0 ? tokens : [options.value.find(t => t.value === 'sol')]
  return tokensFiltered.length !== 0 ? tokens.value : [tokens.value.find(t => t.symbol === 'sol')]
},
)

const { connected } = useWallet()

const balance = computed(() => tokenBalance(state.token.label))

const emptyBalance = computed(() => balance.value === 0)

const insufficientError = computed(() => Number(state.value) > balance.value)

async function transferSubmit() {
  const message = insufficientError.value ? 'Insufficient funds' : 'Not valid address'
  if (!state.valid || insufficientError.value) {
    return Notify.create({
      type: 'negative',
      timeout: 2000,
      message,
    })
  }
  verifyTransfer()
}

function setMaxCurrency() {
  setMax(balance.value)
  if (state.token.value === 'sol') {
    // save additional 2 min fee for next transaction
    state.value = balance.value - RENT_FEE - 3 * MIN_FEE - TRANSFER_FEE_CONST
    // Notify.create({
    //   type: 'negative',
    //   timeout: 0,
    //   message: 'When transferring all funds, you will no longer be able to sign transactions! Leave not a lot of SOL on the account',
    //   actions: [{ icon: evaClose, color: 'white' }],
    // })
  }
}

const active = computed(() => Number(state.value) > 0 && validateAddress(state.address))
</script>

<template>
  <q-card class="swap-card transfer-card">
    <q-card-section class="swap-card__header">
      Transfer
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
                Balance: {{ formatBalance(balance) }}
              </div>
              <div class="col-3  swap-field__label q-pl-sm">
                ASSET
              </div>
            </div>
          </div>
          <div class="row justify-between" style="gap: 10px">
            <q-input
              v-model="state.value" :disable="emptyBalance" :maxlength="14" outlined placeholder="0.0"
              class="swap-input col" @keypress="onlyNumber"
            >
              <template #append>
                <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMaxCurrency">
                  MAX
                </q-btn>
              </template>
            </q-input>

            <select-token
              :disable="!connected"
              :options="filterTokenExist"
              @set-token="setToken"
            />
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
          <dd>{{ formatBalance(state.fee, 6) }}</dd>
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

  <zkp-request-dialog />
</template>
