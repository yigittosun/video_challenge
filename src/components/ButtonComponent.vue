<template>
  <div>
    <button :type="type" :class="btnClass" :disabled="disabled">{{ buttonText }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'button-component',
  props: {
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button'
    },
    btnClass: String as PropType<string>,
    disabled: Boolean as PropType<boolean>,
    buttonText: String as PropType<string>
  }
})
</script>
