<template>
  <BaseSuggestion
    class="x-next-query"
    :suggestion="suggestion"
    :suggestionSelectedEvents="events"
    data-test="next-query"
    feature="next_query"
    :class="{ 'x-next-query--is-curated': shouldHighlightCurated }"
  >
    <template #default="{ suggestion }">
      <!--
        @slot Next Query content
            @binding {Suggestion} suggestion - Next Query suggestion data
            @binding {boolean} shouldHighlightCurated - True if the curated NQ should be highlighted
      -->
      <slot v-bind="{ suggestion, shouldHighlightCurated }">{{ suggestion.query }}</slot>
    </template>
  </BaseSuggestion>
</template>

<script lang="ts">
  import { NextQuery as NextQueryModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue';
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
    @Prop({ required: true })
    protected suggestion!: NextQueryModel;

    /**
     * Indicates if the curated next query should be highlighted.
     *
     * @public
     */
    @Prop({ default: false, type: Boolean })
    protected highlightCurated!: boolean;

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

    /**
     * Checks if the next query is curated and if it should be highlighted.
     *
     * @returns True if the next query is curated and should be highlighted.
     *
     * @internal
     */
    protected get shouldHighlightCurated(): boolean {
      return this.highlightCurated && (this.suggestion.isCurated ?? false);
    }
  }
</script>

<docs lang="mdx">
## Examples

This components expects just a suggestion as a prop to be rendered. It has a slot to override the
content. By default, it renders the suggestion query of the next query. It also has an optional
prop, `highlightCurated`, to indicate if the curated Next Queries should be differentiated with a
CSS class.

### Basic Usage

Using default slot:

```vue live
<template>
  <NextQuery :suggestion="suggestion" />
</template>

<script>
  import { NextQuery } from '@empathyco/x-components/next-queries';

  export default {
    name: 'NextQueryDemo',
    components: {
      NextQuery
    },
    data() {
      return {
        suggestion: {
          modelName: 'NextQuery',
          query: 'tshirt',
          facets: []
        }
      };
    }
  };
</script>
```

### Overriding default slot.

The default slot allows you to replace the content of the suggestion button.

```vue live
<template>
  <NextQuery :suggestion="suggestion">
    <template #default="{ suggestion }">
      <Nq1Icon />
      <span class="x-next-query__query" :aria-label="suggestion.query">{{ suggestion.query }}</span>
    </template>
  </NextQuery>
</template>

<script>
  import { NextQuery } from '@empathyco/x-components/next-queries';
  import { Nq1Icon } from '@empathyco/x-components';

  export default {
    name: 'NextQueryDemo',
    components: {
      NextQuery,
      Nq1Icon
    },
    data() {
      return {
        suggestion: {
          modelName: 'NextQuery',
          query: 'tshirt',
          facets: []
        }
      };
    }
  };
</script>
```

## Dynamic Classes

`NextQuery` uses the following dynamic CSS classes so you can style it when is:

- Curated: `x-next-query--is-curated`.

## Events

A list of events that the component will emit:

- `UserSelectedANextQuery`: the event is emitted after the user clicks the button. The event payload
  is the next query data.
</docs>
