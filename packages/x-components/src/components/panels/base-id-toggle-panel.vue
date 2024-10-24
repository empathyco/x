<template>
  <BaseTogglePanel :open="isOpen" :animation="animation">
    <!-- @slot (Required) Default content -->
    <slot />
  </BaseTogglePanel>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { AnimationProp } from '../../types';
  import { use$x } from '../../composables';
  import { NoAnimation } from '../animations';
  import BaseTogglePanel from './base-toggle-panel.vue';

  /**
   * Simple panel that could receives its initial open state via prop, if not the default is opens
   * and a required prop, named `panelId`, which are responsible of rendering default slot
   * inside a configurable transition.
   *
   * It reacts to `UserClickedPanelToggleButton` event, when their payload matches the component's
   * 'panelId' prop, to handle its open/close state.
   *
   * The default slot offers the possibility to customise the modal content.
   *
   * @public
   */
  export default defineComponent({
    name: 'BaseIdTogglePanel',
    components: { BaseTogglePanel },
    props: {
      /** Shows the panel open at the beginning or not, depending on its state. */
      startOpen: {
        type: Boolean,
        default: true
      },
      /** Animation component that will be used to animate the panel content. */
      animation: {
        type: AnimationProp,
        default: () => NoAnimation
      },
      /**
       * The id to link with the BaseIdTogglePanelButton.
       * Both components must use the same Id to make them interact.
       */
      panelId: {
        type: String,
        required: true
      }
    },
    setup: function (props) {
      const $x = use$x();

      /** Whether the toggle panel is open or not. */
      const isOpen = ref(props.startOpen);

      /**
       * Method to subscribe to the {@link XEventsTypes.UserClickedPanelToggleButton} event.
       *
       * @param panelId - The payload of the {@link XEventsTypes.UserClickedPanelToggleButton} event.
       *
       * @public
       */
      const togglePanel = (panelId: string) => {
        if (props.panelId === panelId) {
          isOpen.value = !isOpen.value;
        }
      };

      $x.on('UserClickedPanelToggleButton', false).subscribe(togglePanel);

      /**
       * Emits the {@link XEventsTypes.TogglePanelStateChanged} event, when the internal state
       * changes.
       *
       * @remarks This event is necessary to link the state with the {@link BaseIdTogglePanelButton}
       * component.
       * @public
       */
      watch(
        () => isOpen.value,
        () => {
          $x.emit('TogglePanelStateChanged', isOpen.value, {
            id: props.panelId,
            target: document.getElementById(props.panelId) as HTMLElement
          });
        },
        { immediate: true }
      );

      return { isOpen };
    }
  });
</script>

<docs lang="mdx">
## Events

A list of events that the component will watch:

- [`UserClickedPanelToggleButton`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the id of the panelId
  that is going to be toggled.

## Examples

### Basic usage

Using default slot:

```vue
<template>
  <div>
    <BaseIdTogglePanelButton panelId="myToggle">
      <img src="./open-button-icon.svg" />
      <span>Toggle Aside</span>
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
