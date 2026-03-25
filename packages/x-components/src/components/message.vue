<template>
  <component :is="animation" class="x-message-container" mode="out-in" data-test="message">
    <slot />
  </component>
</template>
<script lang="ts">
import { Fade } from '@x/components/animations'
import { defineComponent } from 'vue'
import { AnimationProp } from '../types/animation-prop'

/**
 * Message component displays a message with optional animation and customizable CSS classes.
 *
 * @public
 */

export default defineComponent({
  name: 'Message',
  props: {
    /** Animation component that will be used to animate the message. */
    animation: {
      type: AnimationProp,
      default: () => Fade,
    },
  },
})
</script>
