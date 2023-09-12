<template>
  <BaseEventButton
    v-on="$listeners"
    :events="events"
    class="x-result-add-to-cart x-button"
    data-test="result-add-to-cart"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import { computed, defineComponent, PropType } from 'vue';
  import { XEventsTypes } from '../../wiring/events.types';
  import BaseEventButton from '../base-event-button.vue';

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
        required: true
      }
    },
    setup(props) {
      /**
       * The events to be emitted by the button.
       *
       * @returns Events {@link XEventsTypes} to emit.
       *
       * @public
       */
      const events = computed<Partial<XEventsTypes>>(() => ({
        UserClickedResultAddToCart: props.result
      }));

      return {
        events
      };
    }
  });
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
