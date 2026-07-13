<template>
  <BaseEventButton
    :events="events"
    :metadata="metadata"
    class="x-result-add-to-cart xds:button"
    data-test="result-add-to-cart"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
import type { Result } from '@empathyco/x-types'
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../wiring/events.types'
import { defineComponent } from 'vue'
import BaseEventButton from '../base-event-button.vue'

/**
 * Renders a button with a default slot. It receives the result with the data and emits events
 * based on the provided events prop.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseResultAddToCart',
  components: { BaseEventButton },
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
  setup() {
    const metadata = {}

    return {
      metadata,
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the events provided through the `events` prop. The events keys are the event
names and the values are the event payloads.

## Examples

### Basic example

This component is a button to emit events when clicked by the user.

```vue
<template>
  <BaseResultAddToCart :result="result" :events="events">
    <img src="./add-to-cart.svg" alt="Add to cart" />
    <span>Add to cart</span>
  </BaseResultAddToCart>
</template>

<script setup>
import { BaseResultAddToCart } from '@empathyco/x-components'

const result = {
  id: '123',
  name: 'Product name',
  price: 19.99,
}

const events = {
  UserClickedResultAddToCart: result,
}
</script>
```

### Multiple events

You can provide multiple events:

```vue
<template>
  <BaseResultAddToCart :result="result" :events="events">
    <span>Add to cart</span>
  </BaseResultAddToCart>
</template>

<script setup>
import { BaseResultAddToCart } from '@empathyco/x-components'

const result = {
  id: '123',
  name: 'Product name',
  price: 19.99,
}

const events = {
  UserClickedResultAddToCart: result,
  CustomEvent: result,
}
</script>
```
</docs>
