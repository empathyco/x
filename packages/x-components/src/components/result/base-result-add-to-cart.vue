<template>
  <BaseEventButton
    v-on="$listeners"
    :events="events"
    class="x-button x-result-add-to-cart"
    data-test="result-add-to-cart"
    aria-labelledby="result-add-to-cart"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XEventsTypes } from '../../wiring/events.types';
  import BaseEventButton from '../base-event-button.vue';

  /**
   * Renders a button with a default slot. It receives the result with the data and emits
   * {@link XEventsTypes.UserClickedResultAddToCart} to the bus on click mouse event.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseResultAddToCart extends Vue {
    /**
     * (Required) The {@link @empathyco/x-types#Result | result} information.
     *
     * @public
     */
    @Prop({ required: true })
    protected result!: Result;

    /**
     * The events to be emitted by the button.
     *
     * @returns Events {@link XEventsTypes} to emit.
     *
     * @public
     */
    protected get events(): Partial<XEventsTypes> {
      return { UserClickedResultAddToCart: this.result };
    }
  }
</script>

<docs lang="mdx">
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

## Events

A list of events that the component will emit:

- `UserClickedResultAddToCart`: the event is emitted after the user clicks the button. The event
  payload is the result data.
</docs>
