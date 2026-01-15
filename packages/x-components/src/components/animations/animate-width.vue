<template>
  <transition name="x-animate-width-">
    <!-- @slot (Required) Transition content -->
    <slot />
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Renders a transition wrapping an element passed in the default slot and animating its width.
 *
 * @public
 */
export default defineComponent({
  name: 'AnimateWidth',
})
</script>

<style lang="css">
.x-animate-width--enter-active,
.x-animate-width--leave-active {
  transition: width 0.3s ease-out;
  overflow-x: hidden;
}

.x-animate-width--enter-from,
.x-animate-width--leave-to {
  width: 0 !important;
}
</style>

<docs lang="mdx">
## Examples

The AnimateWidth component is intended to be used as a prop in animatable components but also works
as a transition to animate the width of an element.

### Used as a prop in an animatable component:

```vue
<template>
  <AnimatableComponent :animation="AnimateWidth" />
</template>

<script setup>
import AnimateWidth from '@empathyco/x-components/js/components/animations/animate-width.vue'
</script>
```

### Used as a regular Transition:

```vue
<template>
  <div>
    <button @click="visible = !visible">Toggle</button>
    <AnimateWidth>
      <div v-if="visible" style="width: 300px">Element to animate</div>
    </AnimateWidth>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AnimateWidth from '@empathyco/x-components/js/components/animations/animate-width.vue'

const visible = ref(true)
</script>
```
</docs>
