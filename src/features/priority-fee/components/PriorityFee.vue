<!--
  - This file is part of Solana Reference Stake Pool code.
  -
  - Copyright © 2023, mFactory GmbH
  -
  - Solana Reference Stake Pool is free software: you can redistribute it
  - and/or modify it under the terms of the GNU Affero General Public License
  - as published by the Free Software Foundation, either version 3
  - of the License, or (at your option) any later version.
  -
  - Solana Reference Stake Pool is distributed in the hope that it
  - will be useful, but WITHOUT ANY WARRANTY; without even the implied
  - warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  - See the GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program.
  - If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
  -
  - You can be released from the requirements of the Affero GNU General Public License
  - by purchasing a commercial license. The purchase of such a license is
  - mandatory as soon as you develop commercial activities using the
  - Solana Reference Stake Pool code without disclosing the source code of
  - your own applications.
  -
  - The developer of this program can be contacted at <info@mfactory.ch>.
  -->

<script setup lang="ts">
import { evaClose } from '@quasar/extras/eva-icons'
import { DEFAULT_EXACT_FEE, PriorityLevel, PriorityMode } from '../constants'
import { usePriorityFee } from '../index'
import { onlyNumber } from '@/features/priority-fee/utils'
import { formatMoney } from '@/utils'
import { useCoinRateStore } from '@/stores'

const { t } = useTranslation()

const coinRateStore = useCoinRateStore()
const priorityFee = usePriorityFee()
const dialog = ref(false)

const feeAmountHint = computed(() => `~$${formatMoney(coinRateStore.solana.price * priorityFee.exactFee)}`)

const fee = computed(() => {
  if (priorityFee.mode === PriorityMode.ExactFee) {
    return priorityFee.exactFee
  }
  return priorityFee.level
})

const modes = computed(() => {
  return [
    { label: t('priorityFee.maxCap'), value: PriorityMode.MaxCap },
    { label: t('priorityFee.exactFee'), value: PriorityMode.ExactFee },
  ]
})

const levels = computed(() => {
  return [
    { label: t('priorityFee.mode.fast'), value: PriorityLevel.Fast },
    { label: t('priorityFee.mode.turbo'), value: PriorityLevel.Turbo },
    { label: t('priorityFee.mode.ultra'), value: PriorityLevel.Ultra },
  ]
})

function submit() {
  dialog.value = false
  if (priorityFee.exactFee <= 0) {
    priorityFee.exactFee = DEFAULT_EXACT_FEE
  }
}

function localizedFee(fee: string) {
  switch (fee) {
    case PriorityLevel.Fast: return t('priorityFee.mode.fast')
    case PriorityLevel.Turbo: return t('priorityFee.mode.turbo')
    case PriorityLevel.Ultra: return t('priorityFee.mode.ultra')
  }
}
</script>

<template>
  <div class="priority-fee-wrap">
    <div class="priority-fee">
      <q-btn
        :ripple="false"
        :color="$q.dark.isActive ? 'secondary' : 'primary'"
        text-color="white"
        class="q-px-md"
        rounded
        dense
        unelevated
        @click="dialog = true"
      >
        {{ $t('priorityFee.priorityFee') }}: &nbsp; <span class="text-positive">{{ localizedFee(String(fee)) ?? fee }}</span>
      </q-btn>
    </div>
    <q-dialog
      v-model="dialog"
      transition-duration="150"
      transition-show="fade"
      transition-hide="fade"
      class="priority-fee-dialog"
      @hide="submit"
    >
      <q-card class="dialog" style="width: 500px">
        <q-card-section class="relative-position">
          <div class="text-h6 text-center text-uppercase">
            {{ $t('priorityFee.globalFee') }}
          </div>
          <q-btn
            padding="md"
            color="transparent"
            text-color="primary-gray"
            unelevated
            :icon="evaClose"
            class="absolute-right"
            @click="dialog = false"
          />
        </q-card-section>
        <q-separator />
        <q-card-section v-if="priorityFee.mode === PriorityMode.MaxCap">
          <div class="q-mb-sm text-uppercase text-body2">
            <div> {{ $t('priorityFee.priorityLevel') }}:</div>
          </div>
          <q-btn-toggle
            v-model="priorityFee.level"
            unelevated
            spread
            :color="$q.dark.isActive ? 'blue-grey-9' : 'secondary'"
            toggle-color="primary"
            :options="levels"
            :ripple="false"
          />
        </q-card-section>
        <q-card-section>
          <div class="q-mb-sm text-uppercase text-body2">
            <div>{{ $t('priorityFee.priorityMode') }}:</div>
          </div>
          <q-btn-toggle
            v-model="priorityFee.mode"
            :color="$q.dark.isActive ? 'blue-grey-9' : 'secondary'"
            toggle-color="primary"
            :options="modes"
            unelevated
            :ripple="false"
          />
        </q-card-section>
        <q-card-section>
          <template v-if="priorityFee.mode === PriorityMode.MaxCap">
            <div class="text-uppercase text-body2">
              {{ $t('priorityFee.setMaxCap') }}
            </div>
            <p class="text-body2 q-mt-xs" v-html="$t('priorityFee.maxCapInfo')" />
          </template>
          <template v-else>
            <div class="text-uppercase text-body2">
              {{ $t('priorityFee.exactFee') }}
            </div>
            <p class="text-body2 q-mt-xs">
              {{ $t('priorityFee.exactInfo') }}
            </p>
          </template>
          <q-input
            v-model="priorityFee.exactFee"
            placeholder="Enter custom value"
            suffix="SOL"
            clearable
            :hint="feeAmountHint"
            @keypress="onlyNumber"
          />
        </q-card-section>
        <q-card-section>
          <div class="column">
            <q-btn
              color="primary"
              unelevated
              :ripple="false"
              @click="submit"
            >
              {{ $t('priorityFee.save') }}
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss">
.priority-fee-wrap {
  position: relative;
}

.priority-fee-dialog {
  .q-btn {
    font-weight: 400;
  }
}

.priority-fee {
  > .q-btn {
    min-width: 180px;
    width: max-content;
    font-weight: 400;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 36px;
    padding: 4px 16px;

    @media (max-width: $breakpoint-xs) {
      font-size: 12px;
      min-width: 150px;
    }
  }

  @media (max-width: $breakpoint-sm) {
    .q-btn {
      width: 100%;
    }
  }

}
</style>
