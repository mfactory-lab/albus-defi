<script lang="ts" setup>
import { useWallet } from 'solana-wallets-vue'

const { state } = useUserStore()

const { connected } = useWallet()
const isCredential = computed(() => state.vc)

console.log(state)
</script>

<template>
  <div class="credentials">
    <div class="credentials-text">
      VC:
    </div>
    <div v-if="!connected" class="credentials-not-connected">
      -
    </div>
    <div v-else-if="state.loading" class="credentials-loading">
      <q-inner-loading
        :showing="state.loading"
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </div>
    <div v-else-if="!isCredential?.length" class="credentials-info">
      No credentials
      <q-btn
        href="https://albus.finance" target="_blank" size="sm" class="q-ml-sm" color="yellow"
        text-color="primary"
      >
        create
      </q-btn>
    </div>
    <div v-else class="credentials-certificate" loading>
      <a href="https://albus.finance" target="_blank">
        <i-app-certificate href="https://albus.finance" />
      </a>
      <q-tooltip anchor="top middle" self="center middle">
        verified credential
      </q-tooltip>
    </div>
  </div>
</template>

<style lang="scss">
.credentials {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    height: 28px;

    &-not-connected {
        opacity: .5;
    }

    &-loading {
        position: relative;
        width: 28px;
        height: 28px;

        .q-inner-loading--dark {
            background: none;
        }
    }

    &-text {
        font-size: 18px;
        line-height: 25px;
    }

    &-info {
        display: flex;
        align-items: flex-end;
    }

    &-certificate {
        height: 28px;

        svg {
            height: 40px;

            path {
                fill: $yellow;
            }
        }
    }
}
</style>
