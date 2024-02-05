<script lang="ts">
import { copyToClipboard, useQuasar } from 'quasar'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { notify } = useQuasar()
    return {
      copy() {
        copyToClipboard(props.text)
        notify({
          // type: 'positive',
          message: 'Copied to clipboard',
        })
      },
    }
  },
})
</script>

<template>
  <q-btn flat round dense>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="copy"
    >
      <g id="Group 3731">
        <g id="Group 3646">
          <path id="Vector" d="M14.2856 3.46362H2.14284C0.959381 3.46362 0 4.39401 0 5.54171V17.3175C0 18.4652 0.959381 19.3956 2.14284 19.3956H14.2856C15.469 19.3956 16.4284 18.4652 16.4284 17.3175V5.54171C16.4284 4.39401 15.469 3.46362 14.2856 3.46362Z" :fill="$q.dark.isActive ? '#fff' : '#455A64'" />
          <path id="Vector_2" d="M17.8571 1.34184e-09H5.00008C3.82302 -4.05863e-05 2.86628 0.92069 2.85724 2.06214C2.85724 2.0677 2.85724 2.07253 2.85724 2.07809H14.2857C16.2572 2.08036 17.8548 3.62967 17.8571 5.54155V16.6247C17.8629 16.6247 17.8678 16.6247 17.8736 16.6247C19.0506 16.6159 20 15.6881 20 14.5466V2.07809C20 0.930391 19.0406 1.34184e-09 17.8571 1.34184e-09Z" :fill="$q.dark.isActive ? '#fff' : '#455A64'" />
        </g>
      </g>
    </svg>
    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
      Copy to clipboard
    </q-tooltip>
  </q-btn>
</template>
