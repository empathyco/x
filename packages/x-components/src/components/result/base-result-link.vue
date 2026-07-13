<template>
  <a
    :href="result.url"
    class="x-result-link"
    data-test="result-link"
    @click="emitEvents"
    @contextmenu="emitEvents"
    @auxclick="onAuxClick"
  >
    <!--
      @slot (Required) Link content with a text, an image, another component or both
          @binding {Result} result - Result data
     -->
    <slot :result="result" />
  </a>
</template>

<script lang="ts">
import type { Result } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../wiring/events.types'
import { defineComponent } from 'vue'
import { use$x } from '../../composables/index'

/**
 * Component to be reused that renders a link wrapping the result contents.
 *
 * @public
 */
export default defineComponent({
  props: {
    /**
     * (Required) The {@link @empathyco/x-types#Result} information.
     *
     * @public
     */
    result: {
      type: Object as PropType<Result>,
      required: true,
    },
    /**
     * The events to be emitted by the component. The keys are the event names and the values are
     * the event payloads.
     *
     * @public
     */
    events: {
      type: Object as PropType<Partial<XEventsTypes>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const $x = use$x()

    const emitEvents = (event: Event): void => {
      Object.entries(props.events).forEach(([e, payload]) => {
        $x.emit(e as keyof XEventsTypes, payload, { target: event.currentTarget })
      })
    }

    const onAuxClick = (event: MouseEvent): void => {
      if (event.button === 1) {
        emitEvents(event)
      }
    }

    return {
      emitEvents,
      onAuxClick,
    }
  },
})
</script>

<style lang="css" scoped>
.x-result-link {
  text-decoration: none;
}
</style>

<docs lang="mdx">
## Events

This component emits the events provided through the `events` prop. The events keys are the event
names and the values are the event payloads.

## Examples

This component is a wrapper for the result contents (images, name, price...). It may be part of the
search result page, recommendations or other section which needs to include results.

### Basic example

```vue
<template>
  <BaseResultLink :result="result" :events="events">
    <template #default="{ result }">
      <img :src="result.images[0]" alt="Result image" />
      <span>{{ result.name }}</span>
    </template>
  </BaseResultLink>
</template>

<script setup>
import { BaseResultLink } from '@empathyco/x-components'

const result = {
  id: '123',
  name: 'Jacket',
  url: 'https://shop.com/jacket',
  images: ['https://shop.com/jacket.jpg'],
}

const events = {
  UserClickedAResult: result,
}
</script>
```

### Custom events

You can provide custom events to be emitted:

```vue
<template>
  <BaseResultLink :result="result" :events="events">
    <span>{{ result.name }}</span>
  </BaseResultLink>
</template>

<script setup>
import { BaseResultLink } from '@empathyco/x-components'

const result = {
  id: '123',
  name: 'Jacket',
  url: 'https://shop.com/jacket',
}

const events = {
  UserClickedAResult: result,
  CustomEvent: result,
}
</script>
```
</docs>
