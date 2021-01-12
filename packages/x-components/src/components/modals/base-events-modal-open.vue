<template>
  <BaseEventButton
    @click.stop
    :events="events"
    class="x-events-modal-open-button"
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
   * Component containing an event button that emits {@link XEventsTypes.UserClickedOpenX} when
   * clicked. It has a default slot to customize its contents.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton }
  })
  export default class BaseEventsModalOpen extends Vue {
    @Prop({ default: 'UserClickedOpenX' })
    protected openingEvent!: PropsWithType<XEventsTypes, void>;

    protected get events(): Partial<XEventsTypes> {
      return { [this.openingEvent]: undefined };
    }
  }
</script>

<docs lang="mdx">
#Examples

## Basic example

The component rendering content passed to the default slot.

```vue
<BaseEventsModalOpen>
  <img src="./open-button-icon.svg"/>
  <span>Open</span>
</BaseEventsModalOpen>
```

## Defining another event to emit when clicking the button

The component

```vue
<BaseEventsModalOpen openingEvent="UserOpenedEmpathize">
  <span>Open</span>
</BaseEventsModalOpen>
```
</docs>
