<script lang="ts" setup>
import { evaClose } from '@quasar/extras/eva-icons'
import { ZKPRequestStatusWithEmpty } from '@/stores/transfer'

defineProps({
  zkpStatus: Number,
})

const emits = defineEmits(['clearZkpStatus'])

const { createZKPRequest } = useClientStore()

function handleClearStatus() {
  emits('clearZkpStatus')
}
</script>

<template>
  <q-dialog @hide="handleClearStatus">
    <q-card class="zkp-dialog">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">
          Info
        </div>
        <q-space />
        <q-btn v-close-popup :icon="evaClose" flat round dense />
      </q-card-section>

      <q-card-section v-if="zkpStatus === ZKPRequestStatusWithEmpty.Empty" class="q-pt-none">
        To continue, you need to create a ZKP request
      </q-card-section>
      <q-card-section v-if="zkpStatus === ZKPRequestStatusWithEmpty.Pending" class="q-pt-none column">
        To continue, you need to "approve" the request. Follow this link.
        <a class="prove-link" href="https://albus.finance/" target="_blank">__Albus account__</a>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Cancel" />
        <q-btn
          v-if="zkpStatus === ZKPRequestStatusWithEmpty.Empty" v-close-popup flat label="Create"
          @click="createZKPRequest"
        />
        <q-btn v-if="zkpStatus === ZKPRequestStatusWithEmpty.Pending" v-close-popup flat>
          <a href="https://albus.finance/" target="_blank">Approve</a>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
.zkp-dialog {
  .q-btn {
    color: $primary;

    a {
      color: $primary;
    }
  }

  a {
    text-decoration: none;
  }

  .prove-link {
    text-align: center;
    color: $primary;
  }
}
</style>
