<script lang="ts" setup>
import { evaClose } from '@quasar/extras/eva-icons'
import { CREATE_CERTIFICATE_EVENT } from '@/utils'

const emitter = useEmitter()
const dialog = ref(false)
emitter.on(CREATE_CERTIFICATE_EVENT, () => {
  console.log('SHOW CREATE CERT DIALOG')
  dialog.value = true
})
</script>

<template>
  <q-dialog v-model="dialog">
    <q-card class="swap-card">
      <q-card-section class="swap-card__header">
        <div class="text-h6 q-px-md">
          You need a valid Certificate
        </div>
        <q-space />
        <q-btn v-close-popup :icon="evaClose" flat round dense />
      </q-card-section>
      <q-card-section class="swap-card__body row justify-center">
        <policy-card />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
