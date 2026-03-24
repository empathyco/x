<script lang="ts">
import type { XEvent, XEventsTypes } from '../../../wiring/events.types'
import { defineComponent } from 'vue'
import { useXBus } from '../../../composables/use-x-bus'
import { experienceControlsXModule } from '../x-module'

/**
 * This component subscribes to changes in the ExperienceControls module to fire the events that
 * propagate the configuration.
 *
 * @public
 */
export default defineComponent({
  name: 'ExperienceControls',
  xModule: experienceControlsXModule.name,
  setup() {
    const xBus = useXBus()

    /**
     * Iterates the list of XEvents received and emits them.
     *
     * @param events - Events to be emitted.
     */
    function onEventsChanged(events: Partial<XEventsTypes>): void {
      Object.entries(events).forEach(([eventName, eventPayload]) => {
        xBus.emit(eventName as XEvent, eventPayload)
      })
    }

    xBus.on('ExperienceControlsEventsChanged', false).subscribe(event => onEventsChanged(event))

    return () => {}
  },
})
</script>

<docs lang="mdx">
## Examples

This component will fire the events received in the `ExperienceControlsEventsChanged` event.

```vue
<template>
  <ExperienceControls />
</template>

<script setup>
import { ExperienceControls } from '@empathyco/x-components/experience-controls'
</script>
```
</docs>
