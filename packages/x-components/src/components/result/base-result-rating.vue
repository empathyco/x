<template>
  <component
    :is="link ? 'a' : 'div'"
    v-if="result.rating && result.rating.value"
    :ref="el"
    :href="link"
    class="x-result-rating"
    data-test="result-rating"
    @click="emitClickedEvent"
  >
    <!--
      @slot To override the whole content
    -->
    <slot :rating="result.rating.value" :result="result">
      <BaseRating :value="result.rating.value" v-bind="$attrs">
        <template #empty-icon>
          <!--
            @slot The content to render as empty icon
          -->
          <slot name="empty-icon" />
        </template>

        <template #filled-icon>
          <!--
            @slot The content to render as filled icon
          -->
          <slot name="filled-icon" />
        </template>
      </BaseRating>
    </slot>
  </component>
</template>

<script lang="ts">
import type { Result } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { defineComponent, ref } from 'vue'
import { use$x } from '../../composables/index'
import BaseRating from '../base-rating.vue'

/**
 * This component renders a {@link BaseRating} for a result passed as prop.
 *
 * @public
 */
export default defineComponent({
  components: {
    BaseRating,
  },
  inheritAttrs: false,
  props: {
    /**
     * The {@link @empathyco/x-types#Result} to render its rating.
     *
     * @public
     */
    result: {
      type: Object as PropType<Result>,
      required: true,
    },

    /**
     * A link to redirect when rating is clicked.
     *
     * @public
     */
    link: {
      type: String,
    },
  },
  setup(props) {
    const $x = use$x()

    const el = ref<HTMLElement | null>()

    /**
     * Emits the `UserClickedAResultRating` event when user clicks this component, with the
     * {@link @empathyco/x-types#Result} as payload.
     *
     * @internal
     */
    const emitClickedEvent = (): void => {
      $x.emit('UserClickedAResultRating', props.result, {
        target: el.value!,
      })
    }

    return {
      el,
      emitClickedEvent,
    }
  },
})
</script>

<style lang="css" scoped>
.x-result-rating {
  color: inherit;
  text-decoration: none;
}
</style>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserClickedAResultRating`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## Examples

### Basic example

```vue
<template>
  <BaseResultRating :result="result" />
</template>

<script setup>
import { BaseResultRating } from '@empathyco/x-components'
const result = {
  id: 1,
  name: 'Result with rating',
  rating: { value: 3 },
}
</script>
```

### Play with props

#### Custom max value

In this example, the result rating has been configured to 6 as maximum value using the prop `max`.

```vue
<template>
  <BaseResultRating :result="result" :max="6" />
</template>

<script setup>
import { BaseResultRating } from '@empathyco/x-components'
const result = {
  id: 1,
  name: 'Result with rating',
  rating: { value: 3 },
}
</script>
```

#### With link

In this example, the result rating has been configured with a link to redirect when is clicked.

```vue
<template>
  <BaseResultRating :result="result" link="https://empathy.co/" />
</template>

<script setup>
import { BaseResultRating } from '@empathyco/x-components'
const result = {
  id: 1,
  name: 'Result with rating',
  rating: { value: 3 },
}
</script>
```

### Play with events

In this example, a message has been added to be shown when the result rating is clicked.

```vue
<template>
  <BaseResultRating :result="result" @UserClickedAResultRating="logUserClickedRating" />
</template>

<script setup>
import { BaseResultRating } from '@empathyco/x-components'
const result = {
  id: 1,
  name: 'Result with rating',
  rating: { value: 3 },
}
function logUserClickedRating(result) {
  console.log('User clickedRating of this result:', result)
}
</script>
```

## Extending the component

### Custom icons with slots

The rendered icons for rating can be configured through slots. Keep in mind that the icons for both
states (filled and empty), must have the same size make component work properly.

```vue
<template>
  <BaseResultRating :result="result">
    <template #filled-icon>❤️</template>
    <template #empty-icon>🤍</template>
  </BaseResultRating>
</template>

<script setup>
import { BaseResultRating } from '@empathyco/x-components'
const result = {
  id: 1,
  name: 'Result with rating',
  rating: { value: 3 },
}
</script>
```

### Override all content

It is possible to override all the content of the component to show your own rating but keeping the
link and event behaviour:

```vue
<template>
  <BaseResultRating :result="result" #default="{ rating, result }">
    <span v-for="star in rating" :key="star">⭐️</span>
    <span>{{ result.name }}</span>
  </BaseResultRating>
</template>

<script setup>
import { BaseResultRating } from '@empathyco/x-components'
const result = {
  id: 1,
  name: 'Result with rating',
  rating: { value: 3 },
}
</script>
```

### Reuse BaseRating

It is also possible to reuse our rating component:

```vue
<template>
  <BaseResultRating :result="result" #default="{ rating, result }">
    <BaseRating :value="rating" />
    <span>{{ result.name }}</span>
  </BaseResultRating>
</template>

<script setup>
import { BaseResultRating, BaseRating } from '@empathyco/x-components'
const result = {
  id: 1,
  name: 'Result with rating',
  rating: { value: 3 },
}
</script>
```
</docs>
