<template>
  <BaseEventButton
    :events="events"
    class="x-base-id-toggle-panel-button x-button"
    data-test="base-id-toggle-button"
    :aria-pressed="isPanelOpen.toString()"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot :is-panel-open="isPanelOpen" />
  </BaseEventButton>
</template>

<script lang="ts">
import type { XEventsTypes } from '../../wiring/events.types'
import type { WireMetadata } from '../../wiring/wiring.types'
import { computed, defineComponent, ref } from 'vue'
import { useXBus } from '../../composables'
import BaseEventButton from '../base-event-button.vue'

/**
 * Component containing an event button that emits
 * {@link XEventsTypes.UserClickedPanelToggleButton} when clicked with
 * the panelId as payload.
 *
 * It has a default slot to customize its contents.
 *
 * @public
 */
export default defineComponent({
  name: 'BaseIdTogglePanelButton',
  components: { BaseEventButton },
  props: {
    /**
     * The panelId to use for the toggle event listeners.
     */
    panelId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const bus = useXBus()

    /**
     * The panel state to pass through the slot.
     */
    const isPanelOpen = ref(false)

    /**
     * List of events to emit by the BaseEventButton.
     *
     * @returns An object with the event and payload.
     *
     * @internal
     */
    const events = computed(
      (): Partial<XEventsTypes> => ({ UserClickedPanelToggleButton: props.panelId }),
    )

    /**
     * The subscription to the {@link XEventsTypes.TogglePanelStateChanged} event
     * to update the `isPanelOpen` property.
     *
     * @param newState - The new isOpen state of the panel.
     * @param id - The `panelId`.
     * @param id.id - The ID of the `panelId`.
     */
    const updatePanelState = (newState: boolean, { id }: WireMetadata) => {
      if (props.panelId === id) {
        isPanelOpen.value = newState
      }
    }

    bus
      .on('TogglePanelStateChanged', false)
      .subscribe(newState => updatePanelState(newState, { id: props.panelId, moduleName: null }))

    return {
      isPanelOpen,
      events,
    }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedPanelToggleButton`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the id of the panelId
  that is going to be toggled.

## Examples

### Basic example

The component renders content passed to the default slot and toggles the panel with panelId
`myToggle`.

```vue
<template>
  <div>
    <BaseIdTogglePanelButton panelId="myToggle" v-slot="{ isPanelOpen }">
      <template v-if="isPanelOpen">
        <img src="./close-button-icon.svg" alt="Close aside" />
        <span>Close aside</span>
      </template>
      <template v-else>
        <img src="./open-button-icon.svg" alt="Open aside" />
        <span>Open aside</span>
      </template>
    </BaseIdTogglePanelButton>
    <BaseIdTogglePanel :startOpen="true" :animation="animation" panelId="myToggle">
      <div class="x-text1">My toggle</div>
    </BaseIdTogglePanel>
  </div>
</template>

<script setup>
import { BaseIdTogglePanel, BaseIdTogglePanelButton } from '@empathyco/x-components'
import { CollapseFromTop } from '@empathyco/x-components/animations'
const animation = CollapseFromTop
</script>
```
</docs>
