<script lang="ts">
  import Vue from 'vue';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import { XEvent, XEventsTypes } from '../../../wiring/events.types';

  export default class ExperienceControls extends Vue {
    /**
     * This component hear to the change of events in the {@link XStoreModule}, receive them, iterate them and fire them.
     *
     * @param events - The list of the events on the module.
     */
    @XOn('ExperienceControlsEventsChanged')
    onEventsChanged(events: Partial<XEventsTypes>): void {
      Object.entries(events).forEach(([eventName, eventPayload]) => {
        this.$x.emit(eventName as XEvent, eventPayload);
      });
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits all the events of the module.

## See it in action

This component will fire the events when a change is made on the events of the module.

```vue
<template>
  <ExperienceControls></ExperienceControls>
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
