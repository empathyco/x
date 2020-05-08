<template>
  <BaseEventButton
    class="x-remove-history-query"
    :aria-label="$x.config.messages.historyQueries.removeHistoryQuery.ariaLabel"
    :events="removeHistoryQueryEvent"
  >
    <!-- @slot Slot to add the button content like a message or an icon. Has default message -->
    <slot>{{ $x.config.messages.historyQueries.removeHistoryQuery.content }}</slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import { HistoryQuery } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { historyQueriesXModule } from '../x-module';

  /**
   * Button that when it is pressed emits the
   * {@link HistoryQueriesXEvents.UserPressedRemoveHistoryQuery} event, expressing the user
   * intention to remove a query in the history.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(historyQueriesXModule)]
  })
  export default class RemoveHistoryQuery extends Vue {
    /**
     * The historyQuery that will be removed when clicking the clear button.
     *
     * @public
     */
    @Prop({ required: true })
    protected historyQuery!: HistoryQuery;

    /**
     * The event handler that will be triggered when clicking on the clear history query button.
     *
     * @remarks
     * * {@link HistoryQueriesXEvents.UserPressedRemoveHistoryQuery}: historyQuery
     *
     * @returns The {@link XEvent | XEvents} to emit.
     * @public
     */
    protected get removeHistoryQueryEvent(): Partial<XEventsTypes> {
      return { UserPressedRemoveHistoryQuery: this.historyQuery };
    }
  }
</script>

<docs>
  #Examples

  ## Basic Example

  You need to pass a historyQuery as a prop for the button to render:

  ```vue
  <RemoveHistoryQuery :historyQuery="historyQuery"/>
  ```
  This will render by default the message inside the default slot.

  ## Add Custom Button Content Example

  You can add content that this button will render. To do so, you only need to pass a new
  component in the default slot:

  ```vue
  <RemoveHistoryQuery :historyQuery="historyQuery">
    <img class="x-history-query__icon" src="./my-awesome-clear-icon.svg"/>
  </RemoveHistoryQuery>
  ```
</docs>
