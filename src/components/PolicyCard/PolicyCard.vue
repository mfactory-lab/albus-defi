<script lang="ts" setup>
const userStore = useUserStore()
const requiredPolicy = computed(() => userStore.requiredPolicy)
const requiredPolicyData = computed(() => userStore.requiredPolicyData)
</script>

<template>
  <policy-card-view :key="requiredPolicy" :required-policy="requiredPolicy" :required-policy-data="requiredPolicyData" />
</template>
