<template>
  <BaseSuggestion
    v-bind="{ suggestionSelectedEvents, suggestion, query }"
    feature="semantics"
    data-test="semantic-query"
    #default="baseScope"
  >
    <!-- eslint-disable max-len -->
    <!--
      @slot Semantic Query content
          @binding {{suggestion: object - Suggestion data, query: string - The query that the suggestion belongs to}} v-bind BaseSuggestion bindings
    -->
    <!-- eslint-enable max-len -->
    <slot v-bind="{ ...baseScope }" />
  </BaseSuggestion>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { SemanticQuery as SemanticQueryModel } from '@empathyco/x-types';
  import { semanticQueriesXModule } from '../x-module';
  import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue';
  import { useGetter, useRegisterXModule } from '../../../composables';

  useRegisterXModule(semanticQueriesXModule);

  /**
   * This component renders a semantic query. A semantic query is a recommended query
   * that is similar in its meaning to another one.
   * It contains the query and the distance, which indicates how similar the query is
   * compared to the searched query.
   *
   * @public
   */
  export default defineComponent({
    name: 'SemanticQuery',
    components: { BaseSuggestion },
    xModule: semanticQueriesXModule.name,
    props: {
      /**
       * The {@link @empathyco/x-types#SemanticQuery} to render.
       */
      suggestion: {
        type: Object as PropType<SemanticQueryModel>,
        required: true
      }
    },
    setup: function (props) {
      /**
       * The normalized query of the semantic queries module.
       */
      const query = useGetter('querySuggestions', ['normalizedQuery']).normalizedQuery;

      /**
       * The list of events that are going to be emitted when the button is pressed.
       *
       * @internal
       * @returns The {@link XEvent} to emit.
       */
      const suggestionSelectedEvents = {
        UserSelectedASemanticQuery: props.suggestion
      };

      return {
        query,
        suggestionSelectedEvents
      };
    }
  });
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserSelectedASemanticQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the semantic query button. The event payload is the
  semantic query data.

## See it in action

Here you can see that the semantic query query is rendered.

```vue live
<template>
  <SemanticQuery :suggestion="semanticQuery" />
</template>

<script>
  import { SemanticQuery } from '@empathyco/x-components/semantic-queries';

  export default {
    name: 'SemanticQueryDemo',
    components: {
      SemanticQuery
    },
    data() {
      return {
        semanticQuery: {
          modelName: 'SemanticQuery',
          query: 'jacket',
          distance: 2
        }
      };
    }
  };
</script>
```

### Play with the default slot

In this example, we add the distance of the semantic query next to the query.

```vue live
<template>
  <SemanticQuery :suggestion="semanticQuery" #default="{ suggestion, query }">
    <div>Original query: {{ query }}</div>
    <div>Suggested semantic query: {{ suggestion.query }} - {{ suggestion.distance }}</div>
  </SemanticQuery>
</template>

<script>
  import { SemanticQuery } from '@empathyco/x-components/semantic-queries';

  export default {
    name: 'SemanticQueryDemoDefaultSlot',
    components: {
      SemanticQuery
    },
    data() {
      return {
        semanticQuery: {
          modelName: 'SemanticQuery',
          query: 'jacket',
          distance: 2
        }
      };
    }
  };
</script>
```
</docs>
