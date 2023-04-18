<template>
  <button ref="el" v-on="$listeners" @click="emitEvents" data-test="event-button">
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </button>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
  import { XEvent, XEventsTypes } from '../wiring';
  import { use$x } from '../composables/index';

  /**
   * Component to be reused that renders a `<button>` with the logic of emitting events to the bus
   * on click. The events are passed as an object to prop {@link XEventsTypes | events}.
   * The keys are the event name and the values are the payload of each event. All events are
   * emitted with its respective payload. If any event doesn't need payload a `undefined` must be
   * passed as value.
   *
   * @public
   */
  export default defineComponent({
    props: {
      /**
       * (Required) A object where the keys are the {@link XEvent} and the values
       * are the payload of each event.
       *
       * @public
       */
      events: {
        type: Object as PropType<Partial<XEventsTypes>>,
        required: true
      }
    },
    setup(props) {
      const $x = use$x();
      const el = ref<HTMLElement | null>(null);

      const emitEvents = (): void => {
        console.log(props.events);
        Object.entries(props.events).forEach(([event, payload]) => {
          console.log('event: ', event);
          $x.emit(event as XEvent, payload, { target: el.value! });
        });
      };

      return {
        emitEvents,
        el
      };
    }
  });
</script>

<docs lang="mdx">
## Examples

### Basic example

The event prop is required. It will render a <button></button> that emits the event passed as prop
with the value as payload on click:

```vue
<BaseEventButton :events="{ myEvent: payload }" />
```

If the event doesn't need payload then `undefined` must be passed:

```vue
<BaseEventButton :events="{ myEvent: undefined }" />
```

It can emit multiple events at the same time:

```vue
<BaseEventButton :events="{ myFirstEvent: payload1, mySecondEvent: payload2 }" />
```
</docs>
