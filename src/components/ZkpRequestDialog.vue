<script lang="ts" setup>
import { evaClose } from '@quasar/extras/eva-icons'
import { IProofRequestStatus } from '@/stores/client'

const clientStore = useClientStore()

const dialog = ref(false)

function handleClearStatus() {
  clientStore.state.requestStatus = undefined
}

const noRequest = computed(() => IProofRequestStatus.Empty === clientStore.state.requestStatus)
const pendingRequest = computed(() => IProofRequestStatus.Pending === clientStore.state.requestStatus)

watch(() => clientStore.state.requestStatus, (s) => {
  if (typeof s === 'undefined') {
    return
  }

  if (s !== IProofRequestStatus.Proved) {
    dialog.value = true
  }
})
</script>

<template>
  <q-dialog v-model="dialog" @hide="handleClearStatus">
    <q-card class="zkp-dialog">
      <q-card-section class="row items-center q-pb-none zkp-dialog__header">
        <div class="text-h6">
          Info
        </div>
        <q-space />
        <q-btn v-close-popup :icon="evaClose" flat round dense />
      </q-card-section>

      <q-card-section class="q-pt-none zkp-dialog__body">
        <div v-if="noRequest">
          To continue, you need to create a ZKP request
        </div>
        <div v-if="pendingRequest">
          To continue, you need to "approve" the request. Follow this link.
          <a class="prove-link" href="https://albus.finance/" target="_blank">__Albus account__</a>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="zkp-dialog__actions">
        <q-btn v-close-popup flat label="Cancel" class="zkp-dialog__actions--cancel" />
        <q-btn
          v-if="noRequest" v-close-popup outline label="Create"
          color="yellow" @click="clientStore.createProofRequest"
        />
        <q-btn v-if="pendingRequest" v-close-popup color="yellow" outline>
          <a href="https://albus.finance/" target="_blank">Approve</a>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
.zkp-dialog {
  width: 400px;

  &__header {
    padding-bottom: 10px;
    color: $primary;
    border-bottom: 1px solid #e2e2e2;
  }

  &__body {
    padding: 20px 16px 25px;
  }

  &__actions {
    padding: 0 20px 15px;

    &--cancel {
      opacity: .7;

      &:hover {
        opacity: 1;
      }
      .q-focus-helper {
        display: none;
      }
    }
  }

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
