<script setup lang="ts">
const { state } = useSwap()

function setMax(from: any) {
  console.log(from)
}

function swapSubmit() {
  console.log('swapSubmit')
}

function onlyNumber(e: any) {
  const keyCode = e.keyCode ? e.keyCode : e.which
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
    e.preventDefault()
  }
  if (keyCode === 46 && String(e.target.value).includes('.')) {
    e.preventDefault()
  }
}

const options = ['sol', 'usdc', 'usdt']

const model = ref(options[0])

const denseOpts = ref(false)
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
              <div class="col swap-field__label">
                FROM:
              </div>
              <div class="col swap-field__label">
                AMOUNT:
              </div>
              <div class="col swap-field__balance">
                Balance: 1
              </div>
            </div>
          </div>
          <div class="row justify-between" style="gap: 10px">
            <div class="col-4 transfer-select">
              <q-select
                v-model="model" outlined :options="options" dense
                :options-dense="denseOpts"
              >
                <template #prepend>
                  <q-avatar>
                    <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
                  </q-avatar>
                </template>
              </q-select>
            </div>
            <q-input
              v-model="state.from.value" :maxlength="14" outlined placeholder="0.0"
              class="swap-input col" @keypress="onlyNumber"
            >
              <!-- @keyup="changeValue" -->
              <template #append>
                <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMax(state.from)">
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
        <q-input
          v-model="state.from.value" :maxlength="14" outlined
          class="swap-input col" @keypress="onlyNumber"
        />
      </div>

      <div class="swap-info">
        <dl>
          <dt>Swap fee:</dt>
          <dd><!-- {{ formatPercent(state.fees.trade) }} -->0.05 SOL</dd>
        </dl>
      </div>

      <div class="swap-submit transfer-submit">
        <q-btn :loading="state.swapping" :disable="!state.active" rounded :ripple="false" @click="swapSubmit">
          Send
        </q-btn>
      </div>
    </q-card-section>

    <q-inner-loading :showing="state.loading" class="swap-loading" color="grey" />
  </q-card>
</template>
