<template>
  <BaseTogglePanel :open="isOpen" :animation="animation">
    <!-- @slot (Required) Default content -->
    <slot />
  </BaseTogglePanel>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { use$x } from '../../composables'
import { AnimationProp } from '../../types'
import { NoAnimation } from '../animations'
import BaseTogglePanel from './base-toggle-panel.vue'

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
      default: true,
    },
    /** Animation component that will be used to animate the panel content. */
    animation: {
      type: AnimationProp,
      default: () => NoAnimation,
    },
    /**
     * The id to link with the BaseIdTogglePanelButton.
     * Both components must use the same Id to make them interact.
     */
    panelId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const $x = use$x()

    /** Whether the toggle panel is open or not. */
    const isOpen = ref(props.startOpen)

    /**
     * Method to subscribe to the {@link XEventsTypes.UserClickedPanelToggleButton} event.
     *
     * @param panelId - The payload of the {@link XEventsTypes.UserClickedPanelToggleButton} event.
     *
     * @public
     */
    const togglePanel = (panelId: string) => {
      if (props.panelId === panelId) {
        isOpen.value = !isOpen.value
      }
    }

    $x.on('UserClickedPanelToggleButton', false).subscribe(togglePanel)

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
          target: document.getElementById(props.panelId) as HTMLElement,
        })
      },
      { immediate: true },
    )

    return { isOpen }
  },
})
</script>

<docs lang="mdx">
## Events

A list of events that the component will watch and emit:

- [`UserClickedPanelToggleButton`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  watched to toggle the panel when the payload matches the `panelId` prop.
- [`TogglePanelStateChanged`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  emitted when the internal open state changes, with the new state and panel id.

## Examples

### Basic usage

```vue
<template>
  <div>
    <BaseIdTogglePanelButton panelId="myToggle">
      <img src="./open-button-icon.svg" alt="Toggle Aside" />
      <span>Toggle Aside</span>
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

### Listening to state changes

You can listen to the `TogglePanelStateChanged` event to react to panel open/close state changes:

```vue
<template>
  <div>
    <span>Panel is {{ isPanelOpen ? 'open' : 'closed' }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { use$x } from '@empathyco/x-components'

const $x = use$x()
const isPanelOpen = ref(false)
const panelId = 'myToggle'

$x.on('TogglePanelStateChanged').subscribe((isOpen, { id }) => {
  if (id === panelId) {
    isPanelOpen.value = isOpen
  }
})
</script>
```
</docs>
