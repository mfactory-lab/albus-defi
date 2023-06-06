<script setup lang="ts">
import swapCircle from '@/assets/img/swap-circle.svg?raw'

const { state, changeDirection } = useSwap()

const changeButtonRotate = ref(0)

const slippageDialog = ref(false)

const rotateBtnStyle = computed(() => `transform: rotate(${changeButtonRotate.value * 180}deg)`)

function handleChangeDirection() {
  changeDirection()
  changeButtonRotate.value++
}

function openSlippage() {
  slippageDialog.value = true
}
function closeSlippage() {
  slippageDialog.value = false
}

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
</script>

<template>
  <q-card class="swap-card">
    <q-card-section class="swap-card__header">
      Swap
    </q-card-section>

    <q-card-section class="swap-card__body">
      <div class="swap-form">
        <div class="swap-field">
          <div class="swap-field__info">
            <div class="row items-end">
              <div class="col swap-field__label">
                FROM:
              </div>
              <div class="col swap-field__balance">
                Balance: 1
              </div>
            </div>
          </div>
          <q-input
            v-model="state.from.value" :maxlength="14" outlined placeholder="0.0" class="swap-input"
            @keypress="onlyNumber"
          >
            <!-- @keyup="changeValue" -->
            <template #append>
              <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMax(state.from)">
                MAX
              </q-btn>
              <div class="swap-input__icon">
                <img :src="state.from.image" alt="">
              </div>
              <div class="swap-input__symbol">
                {{ state.from.symbol }}
              </div>
            </template>
          </q-input>
        </div>
        <div class="swap-change">
          <q-btn :ripple="false" dense unelevated :style="rotateBtnStyle" @click="handleChangeDirection">
            <i v-html="swapCircle" />
          </q-btn>
        </div>
        <div class="swap-field">
          <div class="swap-field__info">
            <div class="row">
              <div class="col swap-field__label">
                TO:
              </div>
              <div class="col swap-field__balance">
                Balance: 12
              </div>
            </div>
          </div>
          <q-input
            v-model="state.to.value" readonly :maxlength="14" outlined placeholder="0.0"
            class="swap-input"
          >
            <template #append>
              <!--              <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMax(state.to)"> -->
              <!--                MAX -->
              <!--              </q-btn> -->
              <div class="swap-input__icon">
                <img :src="state.to.image" alt="">
              </div>
              <div class="swap-input__symbol">
                {{ state.to.symbol }}
              </div>
            </template>
          </q-input>
        </div>
      </div>

      <div class="swap-info">
        <dl>
          <dt>Minimum Received::</dt>
          <dd>
            <!-- {{ formatPercent(state.priceImpact) }} -->1 SOL
          </dd>
        </dl>
        <dl>
          <dt>Slippage Tolerance:</dt>
          <dd>
            <a href="#" @click="openSlippage"><!-- {{ formatPercent(state.slippage) }} -->0 SOL</a>
          </dd>
        </dl>
        <dl>
          <dt>Swap fee:</dt>
          <dd><!-- {{ formatPercent(state.fees.trade) }} -->1 SOL</dd>
        </dl>
      </div>

      <div class="swap-submit">
        <q-btn :loading="state.swapping" :disable="!state.active" rounded :ripple="false" @click="swapSubmit">
          Swap {{ state.from.symbol }} / {{ state.to.symbol }}
        </q-btn>
      </div>

      <div class="swap-rate">
        1 JPLT ≈ <!-- {{ rate }} -->0 JPLU
      </div>
    </q-card-section>

    <q-inner-loading :showing="state.loading" class="swap-loading" color="grey" />
  </q-card>
  <q-dialog v-model="slippageDialog" transition-duration="100" transition-show="fade" transition-hide="fade">
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
