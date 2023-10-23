<script setup lang="ts">
import { evaClose } from '@quasar/extras/eva-icons'
import type { PropType } from 'vue'
import { lowerCase } from 'lodash-es'
import type { SwapData } from '@/stores/swap'

interface OptionsInactive extends SwapData {
  inactive: boolean
}

const props = defineProps({
  options: Object as any,
  searchToken: String,
  direction: {
    type: Boolean,
    default: false,
  },
  token: Object as PropType<SwapData>,
  swapToken: String,
  disable: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['handleSearchToken', 'setToken'])

const searchToken = ref(props.searchToken)

const model = ref(props.token ?? props.options[0])

watch(() => props.token, (m) => {
  model.value = m
})

function clearSearch() {
  searchToken.value = ''
}

const checkedTokens = computed(() =>
  props.options.map((o: OptionsInactive) => ({ ...o, inactive: lowerCase(String(o.value)) === lowerCase(props.swapToken) })))

watch(searchToken, (s) => {
  emits('handleSearchToken', s)
})

watch(model, (m) => {
  emits('setToken', m, props.direction)
})
</script>

<template>
  <div class="token-select">
    <q-select
      v-model="model" option-disable="inactive" popup-content-class="transition-duration" outlined
      :options="checkedTokens" dense :options-dense="false" :disable="disable"
      @popup-hide="clearSearch"
    >
      <template #prepend>
        <q-avatar>
          <img :src="model.image">
        </q-avatar>
      </template>
      <template #option="scope">
        <q-item v-bind="scope.itemProps" class="token-select__token">
          <q-item-section avatar class="token-select__token--item">
            <q-avatar>
              <img :src="scope.opt.image">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template #no-option>
        <q-input v-model="searchToken" :maxlength="8" outlined class="token-search">
          <template #append>
            <q-icon :name="evaClose" class="cursor-pointer token-search__close" @click="searchToken = ''" />
          </template>
        </q-input>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
