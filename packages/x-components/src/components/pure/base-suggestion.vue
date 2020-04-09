<template>
  <EventButton :events="events" :class="dynamicCSSClasses" class="x-suggestion">
    <!-- @slot Default slot with the suggestion and the highlighted query to customise the output
      @binding {Suggestion} suggestion - The data of the suggestion
      @binding {string} suggestionQueryHighlighted - The suggestion query highlighting the matching
      parts with the query prop
    -->
    <slot v-bind="{ suggestion, suggestionQueryHighlighted }">
      <span
        v-html="suggestionQueryHighlighted"
        :aria-label="suggestion.query"
        class="x-suggestion__query"
      />
    </slot>
  </EventButton>
</template>

<script lang="ts">
  import { Suggestion } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { normalizeString } from '../../utils/normalize';
  import { VueCSSClasses } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';
  import EventButton from './event-button.vue';

  /**
   * Renders a button with a default slot. It receives a query, which should be the query of the
   * module using this component, a suggestion and the {@link XEvent | XEvents} that will be emitted
   * on click.
   *
   * The default slot receives the suggestion and the highlighted query has props.
   *
   * @public
   */
  @Component({
    components: { EventButton }
  })
  export default class BaseSuggestion extends Vue {
    /**
     * The normalized query of the module using this component.
     *
     * @public
     */
    @Prop({ default: '' })
    protected query!: string;

    /**
     * The suggestion to render and use in the default slot.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestion!: Suggestion;

    /**
     * The {@link XEvent | XEvents} that will be emitted when selecting a suggestion.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestionSelectedEvents!: Partial<XEventsTypes>;

    /**
     * The event handler that will be triggered when clicking on a suggestion.
     *
     * @remarks
     * * UserAcceptedAQuery: suggestion.query
     * * UserSelectedASuggestion: suggestion
     * * Merges the events defined in the suggestionSelectedEvents prop and also emits them
     *
     * @returns The {@link XEvent | XEvents} to emit.
     * @public
     */
    protected get events(): Partial<XEventsTypes> {
      return {
        UserAcceptedAQuery: this.suggestion.query,
        UserSelectedASuggestion: this.suggestion,
        ...this.suggestionSelectedEvents
      };
    }

    /**
     * Checks if the normalized suggestion query matches with the module's query so it is
     * highlightable.
     *
     * @returns If the query is highlightable or not.
     * @internal
     */
    protected get isQueryHighlightable(): boolean {
      return !!this.query && normalizeString(this.suggestion.query).includes(this.query);
    }

    /**
     * Generates css classes dynamically.
     *
     * @remarks
     * 'x-suggestion--query-highlighted added when the query should be highlighted.
     *
     * @returns The {@link VueCSSClasses} classes.
     * @public
     */
    protected get dynamicCSSClasses(): VueCSSClasses {
      return {
        'x-suggestion--query-highlighted': this.isQueryHighlightable
      };
    }

    /**
     * Highlights the matching part of the suggestion query with the query passed as prop of the
     * component putting it inside a <span> tag.
     *
     * @remarks
     * The query prop should be normalized.
     *
     * @returns The suggestion's query with the matching part inside a <span> tag.
     * @public
     */
    protected get suggestionQueryHighlighted(): string {
      if (this.isQueryHighlightable) {
        const queryRegExp = new RegExp(`(${this.query})`, 'i');
        return this.suggestion.query.replace(
          queryRegExp,
          `<span class="x-suggestion__query--highlighted">$1</span>`
        );
      }

      return this.suggestion.query;
    }
  }
</script>

<docs>
  #Example

  This default suggestion component expects a suggestion to render and pass to its default slot, a
  normalized query to compare with the suggestion's query and highlight its matching parts and
  events to emit when the suggestion is selected.

  Using default slot:
  ```vue
  <BaseSuggestion v-bind="{ query, suggestion, suggestionSelectedEvents }" />
  ```

  Overriding default slot:

  ```vue
  <BaseSuggestion v-bind="{ query, suggestion, suggestionSelectedEvents }">
    <template #default="{ suggestion, suggestionQueryHighlighted }">
      <span
        class="my-suggestion"
        v-html="suggestionQueryHighlighted"
        :aria-label="suggestion.query"
      />
    </template>
  </BaseSuggestion>
  ```
</docs>
