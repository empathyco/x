<template>
  <BaseSuggestion
    class="x-popular-search"
    :suggestion="suggestion"
    :suggestionSelectedEvents="events"
    data-test="popular-search"
  >
    <template #default="{ suggestion }">
      <!-- @slot Default slot with the suggestion to customise the output
        @binding {Suggestion} suggestion - The data of the suggestion
      -->
      <slot :suggestion="suggestion">{{ suggestion.query }}</slot>
    </template>
  </BaseSuggestion>
</template>

<script lang="ts">
  import { Suggestion } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseSuggestion from '../../../components/base-suggestion.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { popularSearchesXModule } from '../x-module';

  /**
   * Renders a popular search item which receives the suggestion that will be rendered as a prop. It
   * exposes a default slot to change the popular search content. If the slot is not overridden,
   * it will render the suggestion query by default.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestion },
    mixins: [xComponentMixin(popularSearchesXModule)]
  })
  export default class PopularSearch extends Vue {
    /**
     * The suggestion to render and use in the default slot.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestion!: Suggestion;

    /**
     * Events list which are going to be emitted when a popular search is selected.
     *
     * @returns The {@link XEvent | XEvents} to emit.
     * @public
     */
    protected get events(): Partial<XEventsTypes> {
      return {
        UserSelectedAPopularSearch: this.suggestion
      };
    }
  }
</script>

<docs>
  #Example

  This components expects just a suggestion as a prop to be rendered. It has a slot to override
  the content. By default, it renders the suggestion query of the popular search.

  Using default slot:
  ```vue
  <PopularSearch :suggestion="suggestion"/>
  ```

  Overriding default slot:
  ```vue
  <PopularSearch :suggestion="suggestion">
    <template #default="{ suggestion }">
      <svg height="10" width="10">
        <circle cx="5" cy="5" r="4" stroke="black" />
      </svg>
      <span :aria-label="suggestion.query">{{ suggestion.query }}</span>
    </template>
  </PopularSearch>
  ```
</docs>
