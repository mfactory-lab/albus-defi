<script lang="ts" setup>
import { evaCheckmark, evaClose } from '@quasar/extras/eva-icons'
import { SHOW_TRANSACTION_RESULT } from '@/utils'

const emitter = useEmitter()
const dialog = ref(false)
const link = ref('')
emitter.on(SHOW_TRANSACTION_RESULT, (str = '') => {
  dialog.value = true
  link.value = str
})
</script>

<template>
  <q-dialog v-model="dialog" transition-duration="100" transition-show="fade" transition-hide="fade">
    <q-card class="transaction-result" :class="{ 'q-py-md q-px-lg': $q.screen.gt.sm, 'q-pa-md': !$q.screen.gt.sm }">
      <q-icon
        size="20px"
        :name="evaClose"
        class="cursor-pointer absolute-right q-pa-xs"
        @click="dialog = false"
      />
      <div class="column">
        <div class="row q-py-sm " :class="{ 'text-positive': !$q.dark.isActive }">
          <q-icon
            :size="$q.screen.gt.sm ? '32px' : '20px'"
            :name="evaCheckmark"
            class="q-mr-sm"
          />
          <span :class="{ 'text-h5': $q.screen.gt.sm, 'policy-card__title': !$q.screen.gt.sm }">
            The transaction was successful
          </span>
        </div>

        <q-btn
          v-if="link"
          :href="link"
          target="_blank"
          color="primary"
          class="q-mt-sm"
          type="a"
        >
          <span class="q-mx-auto">Explore transaction</span>
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.transaction-result {
  max-width: 100%;
  width: 435px;

  a {
    word-break: break-all;
    color: $primary;

    .body--dark & {
      color: $white;
    }
  }
}
</style>
