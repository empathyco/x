<template>
  <Transition :name="`x-animate-clip-path--${animationOrigin} x-animate-clip-path-`">
    <slot />
  </Transition>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { AnimationOrigin } from './types'

defineProps({
  animationOrigin: {
    type: String as PropType<AnimationOrigin>,
    default: 'top',
  },
})
</script>

<style lang="css">
.x-animate-clip-path--enter-active,
.x-animate-clip-path--leave-active {
  transition: clip-path var(--x-duration-animation, 0.3s) ease-out;
  clip-path: inset(0 0 0 0 round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--top.x-animate-clip-path--enter-from,
.x-animate-clip-path--top.x-animate-clip-path--leave-to {
  clip-path: inset(0 0 100% 0 round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--bottom.x-animate-clip-path--enter-from,
.x-animate-clip-path--bottom.x-animate-clip-path--leave-to {
  clip-path: inset(100% 0 0 0 round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--top-to-bottom.x-animate-clip-path--enter-from {
  clip-path: inset(0 0 100% 0 round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--top-to-bottom.x-animate-clip-path--leave-to {
  clip-path: inset(100% 0 0 0 round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--bottom-to-top.x-animate-clip-path--enter-from {
  clip-path: inset(100% 0 0 0 round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--bottom-to-top.x-animate-clip-path--leave-to {
  clip-path: inset(0 0 100% 0 round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--left.x-animate-clip-path--enter-from,
.x-animate-clip-path--left.x-animate-clip-path--leave-to {
  clip-path: inset(0 100% 0 0 round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--right.x-animate-clip-path--enter-from,
.x-animate-clip-path--right.x-animate-clip-path--leave-to {
  clip-path: inset(0 0 0 100% round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--left-to-right.x-animate-clip-path--enter-from {
  clip-path: inset(0 100% 0 0 round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--left-to-right.x-animate-clip-path--leave-to {
  clip-path: inset(0 0 0 100% round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--right-to-left.x-animate-clip-path--enter-from {
  clip-path: inset(0 0 0 100% round var(--x-size-border-radius-animation-clip-path, 0));
}
.x-animate-clip-path--right-to-left.x-animate-clip-path--leave-to {
  clip-path: inset(0 100% 0 0 round var(--x-size-border-radius-animation-clip-path, 0));
}
</style>
