<script lang="ts">
  import { defineComponent } from 'vue';
  import { XEvent, XEventsTypes } from '../../../wiring/events.types';
  import { experienceControlsXModule } from '../x-module';
  import { useNoElementRender, useXBus } from '../../../composables';

  /**
   * This component subscribes to changes in the ExperienceControls module to fire the events that
   * propagate the configuration.
   *
   * @public
   */
  export default defineComponent({
    name: 'ExperienceControls',
    xModule: experienceControlsXModule.name,
    setup(_, { slots }) {
      const xBus = useXBus();

      /**
       * Iterates the list of XEvents received and emits them.
       *
       * @param events - Events to be emitted.
       */
      function onEventsChanged(events: Partial<XEventsTypes>): void {
        Object.entries(events).forEach(([eventName, eventPayload]) => {
          xBus.emit(eventName as XEvent, eventPayload);
        });
      }

      xBus.on('ExperienceControlsEventsChanged', false).subscribe(event => onEventsChanged(event));

      return () => useNoElementRender(slots);
    }
  });
</script>

<docs lang="mdx">
## Examples

This component will fire the events received in the `ExperienceControlsEventsChanged` event.

```vue
<template>
  <ExperienceControls />
</template>
<script>
  import { ExperienceControls } from '@empathyco/x-components/experience-controls';

  export default {
    name: 'ExperienceControlsDemo',
    components: {
      ExperienceControls
    }
  };
</script>
```
</docs>
