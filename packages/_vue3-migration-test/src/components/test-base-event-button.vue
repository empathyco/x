<template>
  <BaseEventButton @focusin="onFocusin" :events="events" data-id="$attrs working on Vue3!">
    <span>Emit X event!</span>
  </BaseEventButton>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import BaseEventButton from '../../../x-components/src/components/base-event-button.vue';
  import { use$x } from '../../../x-components/src/composables/use-$x';
  import { XEvent, XEventsTypes } from '../../../x-components/src/wiring/events.types';

  /**
   * TODO <script setup> is discarded for the moment in order to avoid problems with XPlugin mixins
   * usage.
   */
  export default defineComponent({
    name: 'TestBaseEventButton',
    components: {
      BaseEventButton
    },
    setup: function () {
      const $x = use$x();

      const events: Partial<XEventsTypes> = {
        UserClickedASort: 'price asc',
        UserClickedPDPAddToCart: 'A012'
      };

      Object.entries(events).forEach(([event]) =>
        $x
          .on(event as XEvent, true)
          // eslint-disable-next-line no-console
          .subscribe(args => console.log('BaseEventButton emission:', args))
      );
      // eslint-disable-next-line no-console
      const onFocusin = (): void => console.log('$listeners working on Vue3!');

      return {
        events,
        onFocusin
      };
    }
  });
</script>
