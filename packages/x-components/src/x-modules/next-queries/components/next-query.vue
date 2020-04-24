<template>
  <BaseSuggestion
    class="x-next-query"
    :suggestion="suggestion"
    :suggestionSelectedEvents="events"
    data-test="next-query"
  >
    <template #default="{ suggestion }">
      <!-- @slot Default slot with the suggestion to customize the next query content -->
      <!-- @binding {Suggestion} suggestion - The data of the suggestion -->
      <slot :suggestion="suggestion">{{ suggestion.query }}</slot>
    </template>
  </BaseSuggestion>
</template>

<script lang="ts">
  import { NextQuery as NextQueryModel } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseSuggestion from '../../../components/base-suggestion.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { nextQueriesXModule } from '../x-module';

  /**
   * Renders a next query item which receives the suggestion that will be rendered as a prop. It
   * exposes a default slot to change the next query content. If the slot is not overridden,
   * it will render the suggestion query by default.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestion },
    mixins: [xComponentMixin(nextQueriesXModule)]
  })
  export default class NextQuery extends Vue {
    /**
     * The suggestion to render and use in the default slot.
     *
     * @public
     */
    @Prop({ required:true })
    protected suggestion!: NextQueryModel;

    /**
     * Events list which are going to be emitted when a next query is selected.
     *
     * @returns The {@link XEvent | XEvents} to emit.
     * @public
     */
    protected get events(): Partial<XEventsTypes> {
      return {
        UserSelectedANextQuery: this.suggestion
      };
    }
  }
</script>

<docs>
  #Example

  This components expects just a suggestion as a prop to be rendered. It has a slot to override
  the content. By default, it renders the suggestion query of the next query.

  ## Basic Usage

  Using default slot:
  ```vue
  <NextQuery :suggestion="suggestion"/>
  ```

  ## Overriding default slot .

  The default slot allows you to replace the content of the suggestion button.

  ```vue
  <NextQuery :suggestion="suggestion">
    <template #default="{ suggestion }">
      <img class="x-next-query__icon" src="./next-query.svg" />
      <span class="x-next-query__query" :aria-label="suggestion.query">{{ suggestion.query }}</span>
    </template>
  </NextQuery>
  ```
</docs>
