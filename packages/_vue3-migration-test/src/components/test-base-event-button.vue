<template>
  <BaseEventButton @focusin="onFocusin" :events="events" data-id="$attrs working on Vue3!">
    <span>Emit X event!</span>
  </BaseEventButton>
</template>

<script setup lang="ts">
  import BaseEventButton from '../../../x-components/src/components/base-event-button.vue';
  import { use$x } from '../../../x-components/src/composables/use-$x';
  import { XEvent, XEventsTypes } from '../../../x-components/src/wiring/events.types';

  // eslint-disable-next-line max-len
  // TODO `$x` name cannot be used while XPlugin defines its own `this.$x` in the mixin: https://github.com/empathyco/x/blob/main/packages/x-components/src/plugins/x-plugin.mixin.ts#L55
  const _$x = use$x();

  const events: Partial<XEventsTypes> = {
    UserClickedASort: 'price asc',
    UserClickedPDPAddToCart: 'A012'
  };

  Object.entries(events).forEach(([event]) =>
    // eslint-disable-next-line no-console
    _$x.on(event as XEvent, true).subscribe(args => console.log('BaseEventButton emission:', args))
  );
  // eslint-disable-next-line no-console
  const onFocusin = (): void => console.log('$listeners working on Vue3!');
</script>
