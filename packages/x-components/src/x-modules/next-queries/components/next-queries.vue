<template>
  <BaseSuggestions
    :suggestions="nextQueries"
    data-test="next-queries"
    class="x-next-queries"
    :animation="animation"
  >
    <template #default="{ suggestion, index }">
      <!--
        @slot Next Query item
            @binding {Suggestion} suggestion - Next Query suggestion data
            @binding {number} index - Next Query suggestion index
      -->
      <slot name="suggestion" v-bind="{ suggestion, index }">
        <NextQuery :suggestion="suggestion" class="x-next-queries__suggestion">
          <template #default>
            <!--
              @slot Next Query content
                  @binding {Suggestion} suggestion - Next Query suggestion data
                  @binding {number} index - Next Query suggestion index
            -->
            <slot name="suggestion-content" v-bind="{ suggestion, index }" />
          </template>
        </NextQuery>
      </slot>
    </template>
  </BaseSuggestions>
</template>

<script lang="ts">
  import { NextQuery as NextQueryModel } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import BaseSuggestions from '../../../components/suggestions/base-suggestions.vue';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { nextQueriesXModule } from '../x-module';
  import NextQuery from './next-query.vue';

  /**
   * Simple next-queries component that renders a list of suggestions, allowing the user to
   * select one of them, and emitting the needed events.
   * A next query is a suggestion for a new search, related to your previous query. I.e. If
   * people normally search for `shirts`, and then `trousers`, `trousers` would be a next query
   * of `shirts`.
   *
   * @public
   */
  @Component({
    components: { NextQuery, BaseSuggestions },
    mixins: [xComponentMixin(nextQueriesXModule)]
  })
  export default class NextQueries extends Vue {
    /**
     * Animation component that will be used to animate the suggestions.
     *
     * @public
     */
    @Prop()
    protected animation!: Vue;

    /**
     * Number of next queries to be rendered.
     *
     * @public
     */
    @Prop({ default: 5 })
    protected maxItemsToRender!: number;

    @Getter('nextQueries', 'nextQueries')
    public storedNextQueries!: NextQueryModel[];

    protected get nextQueries(): NextQueryModel[] {
      return this.storedNextQueries.slice(0, this.maxItemsToRender);
    }
  }
</script>

<docs lang="mdx">
# Examples

## Basic example

You don't need to pass any props, or slots. Simply add the component, and when it has any next
queries it will show them

```vue
<NextQueries />
```

The component has two optional props. `animation` to render the component with an animation and
`maxItemToRender` to limit the number of next queries will be rendered (by default it is 5).

```vue
<NextQueries :animation="FadeAndSlide" :maxItemsToRender="10" />
```

## Overriding Next Queries' Content

You can use your custom implementation of the Next Query's content. In the example below, instead of
using the default Next Query's content, an icon is added, as well as a span with the query of the
Next Query suggestion.

```vue
<NextQueries>
  <template #suggestion-content="{suggestion}">
    <img src="./next-query-icon.svg" class="x-next-query__icon"/>
    <span class="x-next-query__query">{{ suggestion.query }}</span>
  </template>
</NextQueries>
```

## Adding a custom next query component

You can use your custom implementation of a next query component. To work correctly, it should use
the `emitNextQuerySelected` function when the next query is selected. In the example below, instead
of using the default `button` tag for a next query, an icon is added, and the text of the next query
is wrapped in a `span`

```vue
<NextQueries>
  <template #suggestion="{suggestion}">
    <NextQuery :suggestion="suggestion" class="x-next-queries__suggestion">
      <template #default="{suggestion}">
        <img src="./next-query-icon.svg" class="x-next-query__icon"/>
        <span class="x-next-query__query">{{ suggestion.query }}</span>
      </template>
    </NextQuery>
    <button>Custom Behaviour</button>
  </template>
</NextQueries>
```
</docs>
