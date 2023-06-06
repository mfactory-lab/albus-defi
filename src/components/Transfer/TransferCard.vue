<script setup lang="ts">
import { onlyNumber } from '@/utils'

const { state, tokens } = useTransfer()

function setMax(from: any) {
  console.log(from)
}

function swapSubmit() {
  console.log('swapSubmit')
}

const options = computed(() => tokens.map(t => ({
  label: t.name,
  value: t.symbol,
  img: t.img,
})))

const model = ref(options.value[0])

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
                Balance: {{ state.balance }}
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
                    <img :src="model.img">
                  </q-avatar>
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps" class="transfer-select__token">
                    <q-item-section avatar class="transfer-select__token--item">
                      <q-avatar>
                        <img :src="scope.opt.img">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <q-input
              v-model="state.value" :maxlength="14" outlined placeholder="0.0"
              class="swap-input col" @keypress="onlyNumber"
            >
              <!-- @keyup="changeValue" -->
              <template #append>
                <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMax(state.balance)">
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
          v-model="state.address" :maxlength="14" outlined
          class="swap-input col"
        />
      </div>

      <div class="swap-info">
        <dl>
          <dt>Swap fee:</dt>
          <dd><!-- {{ formatPercent(state.fees.trade) }} -->0.05 SOL</dd>
        </dl>
      </div>

      <div class="swap-submit transfer-submit">
        <q-btn :loading="state.loading" :disable="!state.active" rounded :ripple="false" @click="swapSubmit">
          Send
        </q-btn>
      </div>
    </q-card-section>

    <q-inner-loading :showing="state.loading" class="swap-loading" color="grey" />
  </q-card>
</template>
