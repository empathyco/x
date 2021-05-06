<template>
  <BaseEventButton class="x-button x-remove-history-query" :events="removeHistoryQueryEvent">
    <!--  @slot (Required) Button content with a text, an icon or both -->
    <slot />
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

  You can customize the content that this component renders. To do so, simply use the default
  slot.

  ```vue
  <RemoveHistoryQuery :historyQuery="historyQuery">
    <img class="x-history-query__icon" src="./my-awesome-clear-icon.svg"/>
  </RemoveHistoryQuery>
  ```

  ## Events

  A list of events that the component will emit:

  - `UserPressedRemoveHistoryQuery`: the event is emitted after the user clicks the button. The
  event payload is the history query data.
</docs>
