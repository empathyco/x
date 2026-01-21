<template>
  <BaseEventButton
    :events="events"
    class="x-events-modal-close-button x-button"
    data-test="close-modal"
    aria-label="Close"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { PropsWithType } from '../../utils/types'
import type { XEventsTypes } from '../../wiring/events.types'
import { computed, defineComponent } from 'vue'
import BaseEventButton from '../base-event-button.vue'

/**
 * Component contains an event button that emits {@link XEventsTypes.UserClickedCloseEventsModal}
 * when clicked. It has a default slot to customize its contents.
 *
 * @public
 */
export default defineComponent({
  components: {
    BaseEventButton,
  },
  props: {
    /**
     * Event name to use for closing the modal.
     *
     * @public
     */
    closingEvent: {
      type: String as PropType<PropsWithType<XEventsTypes, void>>,
      default: 'UserClickedCloseEventsModal',
    },
  },
  setup(props) {
    const events = computed<Partial<XEventsTypes>>(() => ({ [props.closingEvent]: undefined }))
    return {
      events,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedCloseEventsModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button.

## Examples

The `BaseEventsModalClose` component can be used to close the `BaseEventsModal` component.

### Basic example

On click, the component closes the `BaseEventsModal`. The only required part is the content that
the button should render, which can be anything: text, image, icon, or a combination.

```vue
<template>
  <BaseEventsModalClose>
    <img src="./close-button-icon.svg" />
  </BaseEventsModalClose>
</template>

<script setup>
import { BaseEventsModalClose } from '@empathyco/x-components'
</script>
```

### Defining another event to emit when clicking the button

By default, it uses the same `closingEvent` that the `BaseEventsModal` is listening to. This event can be changed using the `closingEvent` prop.

```vue
<template>
  <BaseEventsModalClose closingEvent="UserClosedEmpathize">×</BaseEventsModalClose>
</template>

<script setup>
import { BaseEventsModalClose } from '@empathyco/x-components'
</script>
```
</docs>
