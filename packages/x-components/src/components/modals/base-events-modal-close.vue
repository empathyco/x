<template>
  <BaseEventButton
    v-on="$listeners"
    :events="events"
    class="x-button x-events-modal-close-button"
    data-test="close-modal"
  >
    <!-- @slot (Required) Button content with a text, an icon or both -->
    <slot />
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { PropsWithType } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';
  import BaseEventButton from '../base-event-button.vue';

  /**
   * Component containing an event button that emits {@link XEventsTypes.UserClickedCloseX} when
   * clicked. It has a default slot to customize its contents.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseEventsModalClose extends Vue {
    @Prop({ default: 'UserClickedCloseX' })
    protected closingEvent!: PropsWithType<XEventsTypes, void>;

    protected get events(): Partial<XEventsTypes> {
      return { [this.closingEvent]: undefined };
    }
  }
</script>

<docs lang="mdx">
#Examples

The `BaseEventsModalClose` component can be used to close the `BaseEventsModal` component.

## Basic example

On clicked, the component closes the `BaseEventsModal`. The only needed thing is the content that
the button should render, that can be any thing: a text, an image, an icon, a combination of the two
of them...

```vue
<template>
  <BaseEventsCloseButton>
    <img src="./close-button-icon.svg" />
  </BaseEventsCloseButton>
</template>

<script>
  import { BaseEventsModalClose } from '@empathyco/x-components';

  export default {
    name: 'BaseEventsModalCloseTest',
    components: {
      BaseEventsModalClose
    }
  };
</script>
```

## Defining another event to emit when clicking the button

By default it uses the same `closingEvent` that the `BaseEventsModal` is listening by default too.
This event can be changed using the `closingEvent` prop.

```vue
<template>
  <BaseEventsModalClose closingEvent="UserClosedEmpathize">×</BaseEventsModalClose>
</template>

<script>
  import { BaseEventsModalClose } from '@empathyco/x-components';

  export default {
    name: 'BaseEventsModalCloseTest',
    components: {
      BaseEventsModalClose
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserClickedCloseX`: the event is emitted after the user clicks the button.
</docs>
