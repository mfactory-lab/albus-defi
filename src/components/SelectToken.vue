<script setup lang="ts">
import { evaClose } from '@quasar/extras/eva-icons'
import type { PropType } from 'vue'
import { lowerCase } from 'lodash-es'
import type { TokenData } from '@/config'

interface OptionsInactive extends TokenData {
  inactive: boolean
}

const props = defineProps({
  options: Object as any,
  searchToken: String,
  direction: {
    type: Boolean,
    default: false,
  },
  token: Object as PropType<TokenData>,
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
  props.options.map((o: OptionsInactive) => ({ ...o, inactive: lowerCase(String(o?.symbol)) === lowerCase(props.swapToken) })))

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
      option-value="mint" option-label="name"
      @popup-hide="clearSearch"
    >
      <template #prepend>
        <q-avatar>
          <img :src="model?.image" :alt="model?.symbol">
        </q-avatar>
      </template>
      <template #before-options>
        <q-input v-model="searchToken" :maxlength="8" outlined class="token-search" placeholder="search">
          <template #append>
            <q-icon
              v-if="searchToken" :name="evaClose" class="cursor-pointer token-search__close"
              @click="clearSearch"
            />
          </template>
        </q-input>
      </template>
      <template #option="scope">
        <q-item v-bind="scope.itemProps" class="token-select__token">
          <q-item-section avatar class="token-select__token--item">
            <q-avatar>
              <img :src="scope.opt.image">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.symbol }}</q-item-label>
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
