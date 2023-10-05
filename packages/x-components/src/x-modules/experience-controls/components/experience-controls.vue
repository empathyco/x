<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import { XEvent, XEventsTypes } from '../../../wiring/events.types';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { experienceControlsXModule } from '../x-module';

  /**
   * This component subscribes to changes in the ExperienceControls module to fire the events that
   * propagate the configuration.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(experienceControlsXModule)]
  })
  export default class ExperienceControls extends Vue {
    /**.
     * Iterates the list of XEvents received and emits them
     *
     * @param events - events to be emitted
     */
    @XOn('ExperienceControlsEventsChanged')
    onEventsChanged(events: Partial<XEventsTypes>): void {
      Object.entries(events).forEach(([eventName, eventPayload]) => {
        this.$x.emit(eventName as XEvent, eventPayload);
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}
  }
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
