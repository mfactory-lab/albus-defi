<script setup lang="ts">
import { formatBalance, onlyNumber } from '@/utils'
import { WRAPPED_SOL_MINT } from '@/config/tokens'

const { state: userState, tokenBalance } = useUserStore()
const { state, wrapSol } = useWrapSol()

const balance = computed(() => tokenBalance(WRAPPED_SOL_MINT))

const emptyBalance = computed(() => balance.value === 0)

const insufficientError = computed(() => Number(state.amount) > balance.value)
</script>

<template>
  <q-card class="swap-card transfer-card">
    <q-card-section class="swap-card__header">
      Wrap SOL
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
            </div>
          </div>
          <div class="row justify-between" style="gap: 10px">
            <q-input
              v-model="state.amount" :disable="emptyBalance" :maxlength="14" outlined placeholder="0.0"
              class="swap-input col" @keypress="onlyNumber"
            />
          </div>
        </div>
      </div>

      <div class="swap-submit q-mt-md">
        <q-btn :loading="state?.processing" rounded :ripple="false" @click="wrapSol">
          Wrap
        </q-btn>
      </div>
    </q-card-section>

    <q-inner-loading :showing="userState?.loading" class="swap-loading" color="grey" />
  </q-card>
</template>
