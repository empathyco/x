<template>
  <Highlight
    #default="{ hasMatch, start, match, end, text }"
    :text="suggestion.query"
    :highlight="query"
  >
    <button
      @click="emitEvents"
      :class="[dynamicCSSClasses, { 'x-suggestion--matching': hasMatch }]"
      class="x-suggestion"
    >
      <!-- eslint-disable max-len -->
      <!--
      @slot Button content
          @binding {Suggestion} suggestion - Suggestion data
          @binding {string} queryHTML - Suggestion's query with the matching part inside a `<span>` tag
          @binding {Filter} filter - Suggestion's filter
      -->
      <!-- eslint-enable max-len -->
      <slot v-bind="{ suggestion, start, match, end, hasMatch, filter }">
        <span class="x-suggestion__query x-highlight" :class="dynamicCSSClasses">
          <template v-if="hasMatch">
            <span class="x-highlight__text">{{ start }}</span>
            <span
              v-text="match"
              class="x-suggestion__matching-part x-highlight__text x-highlight__text--is-match"
              data-test="matching-part"
            />
            <span class="x-highlight__text">{{ end }}</span>
          </template>
          <template v-else>{{ text }}</template>
        </span>
        <span v-if="filter" class="x-suggestion__filter">{{ filter.label }}</span>
      </slot>
    </button>
  </Highlight>
</template>

<script lang="ts">
  import { BooleanFilter, Suggestion } from '@empathyco/x-types';
  import { forEach } from '@empathyco/x-utils';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { QueryFeature } from '../../types';
  import { VueCSSClasses } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';
  import Highlight from '../highlight.vue';

  /**
   * Renders a button with a default slot. It receives a query, which should be the query of the
   * module using this component, a suggestion, the {@link XEvent | XEvents} that will be emitted
   * on click with a given feature.
   *
   * The default slot receives the suggestion and the matched query has props.
   *
   * @public
   */
  @Component({
    components: { Highlight }
  })
  // TODO Refactor highlight usage to be just the query when the suggestion XDS is made.
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
      const filterEvent: Partial<XEventsTypes> = this.filter
        ? { UserClickedAFilter: this.filter }
        : {};
      return {
        UserAcceptedAQuery: this.suggestion.query,
        UserSelectedASuggestion: this.suggestion,
        ...this.suggestionSelectedEvents,
        ...filterEvent
      };
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
      return this.suggestion.facets?.[0]?.filters[0] as BooleanFilter;
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
        'x-suggestion--is-curated': this.shouldHighlightCurated
      };
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
