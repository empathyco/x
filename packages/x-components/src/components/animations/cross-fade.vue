<template>
  <transition name="x-cross-fade-" :appear="appear">
    <!-- @slot (Required) to add content to the transition -->
    <slot />
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Renders a transition wrapping the element passed in the default slot. The transition
 * fades between the two toggled elements at the same time.
 *
 * @public
 */
export default defineComponent({
  name: 'CrossFade',
  props: {
    /**
     * Indicates if the transition must be applied on the initial render of the node.
     */
    appear: {
      type: Boolean,
      default: true,
    },
  },
})
</script>

<style lang="css">
.x-cross-fade--enter-active,
.x-cross-fade--leave-active {
  transition: opacity 0.25s ease-in-out;
  mix-blend-mode: multiply;
}

.x-cross-fade--leave-active {
  position: absolute;
}

.x-cross-fade--leave-to,
.x-cross-fade--enter-from {
  opacity: 0 !important;
}
</style>

<docs lang="mdx">
## Example

The `CrossFade` component is intended to be used as animation to wrap an element with v-if or v-show
and animate it. The animation fades the new element into the previous one.

Wrapping a component:

```vue
<CrossFade>
  <ComponentOrElement v-if="open"/>
</CrossFade>
```
</docs>
