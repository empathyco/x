<script lang="ts">
import { defineComponent } from 'vue'

/**
 * Component to be used as `default` for animation props together with dynamic components
 * `<component :is="animation">` in the template.
 */
export default defineComponent({
  name: 'NoAnimation',
  setup(_, { slots }) {
    return () => slots.default?.()[0] ?? ''
  },
})
</script>

<docs lang="mdx">
## Examples

The `NoAnimation` component is intended to be used as the default for animation props together with dynamic components, for example:

### Basic usage with dynamic component

```vue
<template>
  <component :is="animation">
    <div>Content without animation</div>
  </component>
</template>

<script setup>
import NoAnimation from '@empathyco/x-components/js/components/animations/no-animation.vue'

const animation = NoAnimation
</script>
```
</docs>
