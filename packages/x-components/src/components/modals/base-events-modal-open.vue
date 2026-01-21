<template>
  <BaseEventButton
    :events="events"
    class="x-events-modal-open-button x-button"
    data-test="open-modal"
    aria-label="Open"
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
 * Component contains an event button that emits {@link XEventsTypes.UserClickedOpenEventsModal}
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
     * Event name to use for opening the modal.
     *
     * @public
     */
    openingEvent: {
      type: String as PropType<PropsWithType<XEventsTypes, void>>,
      default: 'UserClickedOpenEventsModal',
    },
  },
  setup(props) {
    const events = computed<Partial<XEventsTypes>>(() => ({ [props.openingEvent]: undefined }))

    return {
      events,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedOpenEventsModal`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button.

## Examples

This component serves to open the `BaseEventsModal`.

### Basic example

On click, the component opens the `BaseEventsModal`. The only required part is the content that
the button should render, which can be anything: text, image, icon, or a combination.

```vue
<template>
  <BaseEventsModalOpen>
    <img src="./open-button-icon.svg" />
    <span>Open</span>
  </BaseEventsModalOpen>
</template>

<script setup>
import { BaseEventsModalOpen } from '@empathyco/x-components'
</script>
```

### Defining another event to emit when clicking the button

By default, it uses the same `openingEvent` that the `BaseEventsModal` is listening to by default.
This event can be changed using the `openingEvent` prop, but remember to change it in the target `BaseEventsModal` too.

```vue
<template>
  <BaseEventsModalOpen openingEvent="UserOpenedEmpathize">
    <span>Open</span>
  </BaseEventsModalOpen>
</template>

<script setup>
import { BaseEventsModalOpen } from '@empathyco/x-components'
</script>
```
</docs>
