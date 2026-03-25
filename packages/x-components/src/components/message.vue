<template>
  <component :is="animation" class="x-message-container" mode="out-in" data-test="message">
    <slot />
  </component>
</template>
<script setup lang="ts">
import { Fade } from '@x/components/animations'
import { AnimationProp } from '../types/animation-prop'

/**
 * Message component displays a message with optional animation and customizable CSS classes.
 *
 * @public
 */

defineProps({
  /** Animation component that will be used to animate the message. */
  animation: {
    type: AnimationProp,
    default: () => Fade,
  },
})
</script>
