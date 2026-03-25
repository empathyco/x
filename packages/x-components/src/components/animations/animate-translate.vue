<template>
  <Transition :name="`x-animate-translate--${animationOrigin} x-animate-translate-`">
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import type { AnimationOrigin } from './animation-origin'

defineProps({
  animationOrigin: {
    type: String as () => AnimationOrigin,
    default: 'top',
  },
})
</script>

<style lang="css">
.x-animate-translate--enter-active,
.x-animate-translate--leave-active {
  transition: transform var(--x-duration-animation, 0.3s) ease-out;
}
.x-animate-translate--top.x-animate-translate--enter-from,
.x-animate-translate--top.x-animate-translate--leave-to {
  transform: translateY(-100%);
}
.x-animate-translate--bottom.x-animate-translate--enter-from,
.x-animate-translate--bottom.x-animate-translate--leave-to {
  transform: translateY(100%);
}
.x-animate-translate--top-to-bottom.x-animate-translate--enter-from {
  transform: translateY(-100%);
}
.x-animate-translate--top-to-bottom.x-animate-translate--leave-to {
  transform: translateY(100%);
}
.x-animate-translate--bottom-to-top.x-animate-translate--enter-from {
  transform: translateY(100%);
}
.x-animate-translate--bottom-to-top.x-animate-translate--leave-to {
  transform: translateY(-100%);
}
.x-animate-translate--left.x-animate-translate--enter-from,
.x-animate-translate--left.x-animate-translate--leave-to {
  transform: translateX(-100%);
}
.x-animate-translate--right.x-animate-translate--enter-from,
.x-animate-translate--right.x-animate-translate--leave-to {
  transform: translateX(100%);
}
.x-animate-translate--left-to-right.x-animate-translate--enter-from {
  transform: translateX(-100%);
}
.x-animate-translate--left-to-right.x-animate-translate--leave-to {
  transform: translateX(100%);
}
.x-animate-translate--right-to-left.x-animate-translate--enter-from {
  transform: translateX(100%);
}
.x-animate-translate--right-to-left.x-animate-translate--leave-to {
  transform: translateX(-100%);
}
</style>
