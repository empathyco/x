<template>
  <BaseEventButton
    v-on="$listeners"
    :events="events"
    class="x-button x-events-modal-open-button"
    data-test="open-modal"
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
   * Component contains an event button that emits {@link XEventsTypes.UserClickedOpenEventsModal}
   * when clicked. It has a default slot to customize its contents.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseEventsModalOpen extends Vue {
    @Prop({ default: 'UserClickedOpenEventsModal' })
    protected openingEvent!: PropsWithType<XEventsTypes, void>;

    protected get events(): Partial<XEventsTypes> {
      return { [this.openingEvent]: undefined };
    }
  }
</script>

<docs lang="mdx">
#Examples

This component serves to open the `BaseEventsModal`.

## Basic example

On clicked, the component closes the `BaseEventsModal`. The only needed thing is the content that
the button should render, that can be any thing: a text, an image, an icon, a combination of the two
of them...

```vue
<template>
  <BaseEventsModalOpen>
    <img src="./open-button-icon.svg" />
    <span>Open</span>
  </BaseEventsModalOpen>
</template>

<script>
  import { BaseEventsModalOpen } from '@empathyco/x-components';

  export default {
    name: 'BaseEventsModalOpenTest',
    components: {
      BaseEventsModalOpen
    }
  };
</script>
```

## Defining another event to emit when clicking the button

By default it uses the same `openingEvent` that the `BaseEventsModal` is listening by default too.
This event can be changed using the `openingEvent` prop, but remember to change it in the target
`BaseEventsModal` too.

```vue
<template>
  <BaseEventsModalOpen openingEvent="UserOpenedEmpathize">
    <span>Open</span>
  </BaseEventsModalOpen>
</template>

<script>
  import { BaseEventsModalOpen } from '@empathyco/x-components';

  export default {
    name: 'BaseEventsModalOpenTest',
    components: {
      BaseEventsModalOpen
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserClickedOpenEventsModal`: the event is emitted after the user clicks the button.
</docs>
