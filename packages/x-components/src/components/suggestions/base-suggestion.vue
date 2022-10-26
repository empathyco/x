<template>
  <button @click="emitEvents" :class="dynamicCSSClasses" class="x-suggestion">
    <!-- eslint-disable max-len -->
    <!--
      @slot Button content
          @binding {Suggestion} suggestion - Suggestion data
          @binding {string} queryHTML - Suggestion's query with the matching part inside a `<span>` tag
          @binding {Filter} filter - Suggestion's filter
    -->
    <!-- eslint-enable max-len -->
    <slot v-bind="{ suggestion, queryHTML, filter }">
      <span v-html="queryHTML" :aria-label="suggestion.query" class="x-suggestion__query" />
      <span v-if="filter" class="x-suggestion__filter">{{ filter.label }}</span>
    </slot>
  </button>
</template>

<script lang="ts">
  import { BooleanFilter, Suggestion } from '@empathyco/x-types';
  import { forEach } from '@empathyco/x-utils';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { QueryFeature } from '../../types';
  import { normalizeString } from '../../utils/normalize';
  import { sanitize } from '../../utils/sanitize';
  import { VueCSSClasses } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';

  /**
   * Renders a button with a default slot. It receives a query, which should be the query of the
   * module using this component, a suggestion, the {@link XEvent | XEvents} that will be emitted
   * on click with a given feature.
   *
   * The default slot receives the suggestion and the matched query has props.
   *
   * @public
   */
  @Component
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
     * The feature from which the events will be emitted.
     *
     * @public
     */
    @Prop() //TODO: set to true when the suggestions components pass it.
    protected feature?: QueryFeature;

    /**
     * The {@link XEvent | XEvents} that will be emitted when selecting a suggestion.
     *
     * @public
     */
    @Prop({ required: true })
    protected suggestionSelectedEvents!: Partial<XEventsTypes>;

    /**
     * Indicates if the curated suggestion should be highlighted.
     *
     * @public
     */
    @Prop({ default: false, type: Boolean })
    protected highlightCurated!: boolean;

    /**
     * Indicates if there are facets available.
     *
     * @returns True if there are facets available and false otherwise.
     * @internal
     */
    protected get hasFacets(): boolean {
      return !!this.suggestion.facets?.length;
    }

    /**
     * The event handler that will be triggered when clicking on a suggestion.
     *
     * @remarks
     * UserAcceptedAQuery: suggestion.query
     * UserSelectedASuggestion: suggestion
     * UserClickedAFilter: suggestion.facets[0].filters[0]
     * Merges the events defined in the suggestionSelectedEvents prop and also emits them
     *
     * @returns The {@link XEvent | XEvents} to emit.
     * @public
     */
    protected get events(): Partial<XEventsTypes> {
      const events = {
        UserAcceptedAQuery: this.suggestion.query,
        UserSelectedASuggestion: this.suggestion,
        ...this.suggestionSelectedEvents
      };
      if (this.filter) {
        events.UserClickedAFilter = this.filter;
      }
      return events;
    }

    /**
     * Emits the events when the button is clicked.
     *
     * @public
     */
    protected emitEvents(): void {
      forEach(this.events, (event, payload) => {
        this.$x.emit(event, payload, {
          target: this.$el as HTMLElement,
          feature: this.feature
        });
      });
    }

    /**
     * Returns the suggestion filter object.
     * It is a BooleanFilter because the label is needed.
     * It returns only the first element because the facets and filters are being planned
     * in the BaseSuggestions component.
     *
     * @returns The filter.
     * @public
     */
    protected get filter(): BooleanFilter | undefined {
      return this.suggestion.facets?.length
        ? (this.suggestion.facets[0].filters[0] as BooleanFilter)
        : undefined;
    }

    /**
     * Checks if the normalized suggestion query matches with the module's query, so it has a
     * matching part.
     *
     * @returns If the query has a matching part or not.
     * @internal
     */
    protected get hasMatchingQuery(): boolean {
      return !!this.query && normalizeString(this.suggestion.query).includes(this.query);
    }

    /**
     * Checks if the suggestion is curated and if it should be highlighted.
     *
     * @returns True if the suggestion is curated and should be highlighted.
     *
     * @internal
     */
    protected get shouldHighlightCurated(): boolean {
      return this.highlightCurated && !!this.suggestion.isCurated;
    }

    /**
     * Generates css classes dynamically.
     *
     * @remarks
     * 'x-suggestion--matching added when the query should be matched.
     *
     * @returns The {@link VueCSSClasses} classes.
     * @public
     */
    protected get dynamicCSSClasses(): VueCSSClasses {
      return {
        'x-suggestion--matching': this.hasMatchingQuery,
        'x-suggestion--is-curated': this.shouldHighlightCurated
      };
    }

    /**
     * Highlights the matching part of the suggestion query with the query passed as prop of the
     * component putting it inside a `<span>` tag.
     *
     * @remarks
     * The query prop should be normalized.
     *
     * @returns The suggestion's query with the matching part inside a `<span>` tag.
     * @public
     */
    protected get queryHTML(): string {
      if (this.hasMatchingQuery) {
        const matcherIndex = normalizeString(this.suggestion.query).indexOf(this.query);

        const [beginning, matching, end] = this.splitAt(
          this.suggestion.query,
          matcherIndex,
          this.query.length
        );

        const attrsMatching = 'data-test="matching-part" class="x-suggestion__matching-part"';
        return `${beginning}<span ${attrsMatching}>${matching}</span>${end}`;
      }

      return sanitize(this.suggestion.query);
    }

    /**
     * Splits the label in three parts based on two indexes.
     *
     * @param label - The string that will be divided in three parts.
     * @param start - The first index that the label will be divided by.
     * @param skip - The second index that the label will be divided by.
     *
     * @returns The three parts of the divided label.
     * @internal
     */
    protected splitAt(label: string, start: number, skip: number): [string, string, string] {
      const startPart = label.substr(0, start);
      const matchingPart = label.substr(start, skip);
      const endPart = label.substr(start + skip);

      return [sanitize(startPart), sanitize(matchingPart), sanitize(endPart)];
    }
  }
</script>

<docs lang="mdx">
## Examples

This default suggestion component expects a suggestion to render and pass to its default slot, a
normalized query to compare with the suggestion's query and highlight its matching parts and events
to emit when the suggestion is selected.

If the suggestion contains a filter, it is displayed next to the suggestion.

### Default usage

```vue
<BaseSuggestion v-bind="{ query, suggestion, suggestionSelectedEvents }" />
```

### Customized usage

```vue
<BaseSuggestion v-bind="{ query, suggestion, suggestionSelectedEvents }">
  <template #default="{ suggestion, queryHTML }">
    <span
      class="my-suggestion"
      v-html="queryHTML"
      :aria-label="suggestion.query"
    />
  </template>
</BaseSuggestion>
```

### Customized usage with filter

```vue
<BaseSuggestion v-bind="{ query, suggestion, suggestionSelectedEvents }">
  <template #default="{ suggestion, queryHTML, filter }">
    <span
      class="my-suggestion"
      v-html="queryHTML"
      :aria-label="suggestion.query"
    />
    <span>{{ filter.label }}</span>
  </template>
</BaseSuggestion>
```

## Events

A list of events that the component will emit:

- `UserAcceptedAQuery`: the event is emitted after the user clicks the button. The event payload is
  the suggestion query data.
- `UserSelectedASuggestion`: the event is emitted after the user clicks the button. The event
  payload is the suggestion data.
- `UserClickedAFilter`: the event is emitted after the user clicks the button if the suggestion
  includes a filter. The event payload is the suggestion filter.
- The component can emit more events on click using the `suggestionSelectedEvents` prop.
</docs>
