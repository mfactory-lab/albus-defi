<script lang="ts" setup>
const authStore = useAuthStore()
const error = ref(false)
const password = ref('')

function login() {
  if (!authStore.login(password.value)) {
    password.value = ''
    error.value = true
  }
}
</script>

<template>
  <q-layout :class="$style.layout">
    <q-page-container>
      <q-page class="window-height window-width row justify-center items-center">
        <div class="column">
          <div class="row">
            <q-card class="q-pa-lg shadow-1">
              <q-card-section>
                <q-form class="q-gutter-md">
                  <q-input
                    v-model="password"
                    :class="$style.input"
                    :error="error"
                    placeholder="Secret Code"
                    type="password"
                    outlined
                  >
                    <template #append>
                      <q-btn flat rounded @click="login">
                        GO
                      </q-btn>
                    </template>
                  </q-input>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" module>
  .input {
    width: 240px;
    input {
      &::placeholder {
        color: #aaa;
      }
    }
  }

  .layout {
    background-color: $blue-grey-1;
  }

  .logo {
    font-size: 40px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1rem;
    color: #333;
  }
</style>
