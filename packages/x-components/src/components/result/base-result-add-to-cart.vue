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
import type { PropsWithType } from '../../utils/index'
import type { XEventsTypes } from '../../wiring/events.types'
import type { WireMetadata } from '../../wiring/index'
import { computed, defineComponent, inject } from 'vue'
import BaseEventButton from '../base-event-button.vue'

/**
 * Renders a button with a default slot. It receives the result with the data and emits
 * {@link XEventsTypes.UserClickedResultAddToCart} to the bus on click mouse event.
 *
 * @public
 */
export default defineComponent({
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
  },
  setup(props) {
    /**
     * The list of additional events to be emitted by the component when user clicks the add2cart button.
     *
     * @internal
     */
    const resultAddToCartExtraEvents = inject<PropsWithType<XEventsTypes, Result>[]>(
      'resultAddToCartExtraEvents',
      [],
    )

    /**
     * The metadata to be injected in the events emitted by the component.
     */
    const metadata = inject<Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>>(
      'resultAddToCartExtraEventsMetadata',
      {},
    )

    /**
     * The events to be emitted by the button.
     *
     * @returns Events {@link XEventsTypes} to emit.
     *
     * @public
     */
    const events = computed(() => {
      return resultAddToCartExtraEvents.reduce(
        (acc, event) => {
          acc[event] = props.result
          return acc
        },
        { UserClickedResultAddToCart: props.result } as Partial<XEventsTypes>,
      )
    })

    return {
      events,
      metadata,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedResultAddToCart`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the result data.

## Examples

Renders a button with a default slot. It receives the result with the data and emits an event
`UserClickedResultAddToCart` to the bus on click mouse event.

### Basic example

This component is a button to emit `UserClickedResultAddToCart` whe clicked by the user

```vue
<BaseResultAddToCart :result="result">
  <img src="./add-to-cart.svg" />
  <span>Add to cart</span>
</BaseResultAddToCart>
```
</docs>
