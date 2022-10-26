<template>
  <BaseEventButton
    v-on="$listeners"
    :events="events"
    class="x-button x-base-id-toggle-panel-button"
    data-test="base-id-toggle-button"
    :aria-pressed="isPanelOpen"
    aria-labelledby="toggle-panel"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot :isPanelOpen="isPanelOpen" />
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { XEventsTypes } from '../../wiring/events.types';
  import { WireMetadata } from '../../wiring/wiring.types';
  import BaseEventButton from '../base-event-button.vue';
  import { XOn } from '../decorators/bus.decorators';

  /**
   * Component containing an event button that emits
   * {@link XEventsTypes.UserClickedPanelToggleButton} when clicked with
   * the panelId as payload.
   *
   * It has a default slot to customize its contents.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseIdTogglePanelButton extends Vue {
    /**
     * The panel state to pass through the slot.
     */
    protected isPanelOpen = false;

    /** The panelId to use for the toggle event listeners. */
    @Prop({ required: true })
    protected panelId!: string;

    /**
     * List of events to emit by the BaseEventButton.
     *
     * @returns An object with the event and payload.
     *
     * @internal
     */
    protected get events(): Partial<XEventsTypes> {
      return { UserClickedPanelToggleButton: this.panelId };
    }

    /**
     * The subscription to the {@link XEventsTypes.TogglePanelStateChanged} event
     * to update the `isPanelOpen` property.
     *
     * @param newState - The new isOpen state of the panel.
     * @param id - The `panelId`.
     */
    @XOn('TogglePanelStateChanged')
    updatePanelState(newState: boolean, { id }: WireMetadata): void {
      if (this.panelId === id) {
        this.isPanelOpen = newState;
      }
    }
  }
</script>

<docs lang="mdx">
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
      <div class="x-text">My toggle</div>
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

## Events

A list of events that the component will emit:

- `UserClickedPanelToggleButton`: the event is emitted after the user clicks the button. The event
  payload is the id of the panelId that is going to be toggled.
</docs>
