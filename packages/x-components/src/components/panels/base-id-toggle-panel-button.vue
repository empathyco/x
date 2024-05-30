<template>
  <BaseEventButton
    v-on="$listeners"
    :events="events"
    class="x-base-id-toggle-panel-button x-button"
    data-test="base-id-toggle-button"
    :aria-pressed="isPanelOpen"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot :isPanelOpen="isPanelOpen" />
  </BaseEventButton>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { XEventsTypes } from '../../wiring/events.types';
  import { WireMetadata } from '../../wiring/wiring.types';
  import BaseEventButton from '../base-event-button.vue';
  import { useXBus } from '../../composables';

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
        required: true
      }
    },
    setup: function (props) {
      const bus = useXBus();

      /**
       * The panel state to pass through the slot.
       */
      const isPanelOpen = ref(false);

      /**
       * List of events to emit by the BaseEventButton.
       *
       * @returns An object with the event and payload.
       *
       * @internal
       */
      const events = computed(
        (): Partial<XEventsTypes> => ({ UserClickedPanelToggleButton: props.panelId })
      );

      /**
       * The subscription to the {@link XEventsTypes.TogglePanelStateChanged} event
       * to update the `isPanelOpen` property.
       *
       * @param newState - The new isOpen state of the panel.
       * @param id - The `panelId`.
       */
      const updatePanelState = (newState: boolean, { id }: WireMetadata) => {
        if (props.panelId === id) {
          isPanelOpen.value = newState;
        }
      };

      bus
        .on('TogglePanelStateChanged', false)
        .subscribe(newState => updatePanelState(newState, { id: props.panelId, moduleName: null }));

      return {
        isPanelOpen,
        events
      };
    }
  });
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedPanelToggleButton`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the id of the panelId
  that is going to be toggled.

## Examples

### Basic example

The component rendering content passed to the default slot and opening the panel toggle with panelId
`my-toggle`.

```vue
<template>
  <div>
    <BaseIdTogglePanelButton v-slot="{ isPanelOpen }" panelId="myToggle">
      <template #default="{ isPanelOpen }" v-if="isPanelOpen">
        <img src="./close-button-icon.svg" />
        <span>Close aside</span>
      </template>
      <template v-else>
        <img src="./open-button-icon.svg" />
        <span>Open aside</span>
      </template>
    </BaseIdTogglePanelButton>
    <BaseIdTogglePanel :startOpen="true" :animation="animation" panelId="myToggle">
      <div class="x-text1">My toggle</div>
    </BaseIdTogglePanel>
  </div>
</template>

<script>
  import {
    BaseIdTogglePanel,
    BaseIdTogglePanelButton,
    CollapseFromTop
  } from '@empathyco/x-components';

  export default {
    components: {
      BaseIdTogglePanel,
      BaseIdTogglePanelButton,
      CollapseFromTop
    },
    data: function () {
      return {
        animation: CollapseFromTop
      };
    }
  };
</script>
```
</docs>
