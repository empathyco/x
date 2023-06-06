<template>
  <BaseSuggestion
    :suggestionSelectedEvents="suggestionSelectedEvents"
    :suggestion="semanticQuery"
    feature="semantics"
    data-test="semantic-query"
  >
    <slot :query="semanticQuery" />
  </BaseSuggestion>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { SemanticQuery as SemanticQueryModel } from '@empathyco/x-types';
  import { xComponentMixin } from '../../../components';
  import { semanticQueriesXModule } from '../x-module';
  import BaseSuggestion from '../../../components/suggestions/base-suggestion.vue';
  import { XEventsTypes } from '../../../wiring';

  /**
   * This component renders a semantic query. A semantic query is a recommended query
   * that is similar in its meaning to another one.
   * It contains the query and the distance, which indicates how similar the query is
   * compared to the searched query.
   *
   * @public
   */
  @Component({
    components: { BaseSuggestion },
    mixins: [xComponentMixin(semanticQueriesXModule)]
  })
  export default class SemanticQuery extends Vue {
    /**
     * The {@link @empathyco/x-types#SemanticQuery} to render.
     */
    @Prop()
    public semanticQuery!: SemanticQueryModel;

    /**
     * The list of events that are going to be emitted when the button is pressed.
     *
     * @internal
     * @returns The {@link XEvent | XEvents } to emit.
     */
    protected get suggestionSelectedEvents(): Partial<XEventsTypes> {
      return {
        UserSelectedASemanticQuery: this.semanticQuery
      };
    }
  }
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- `UserSelectedASemanticQuery`: the event is emitted after the user clicks the semantic query
  button. The event payload is the semantic query data.

## See it in action

Here you can see that the semantic query query is rendered.

```vue live
<template>
  <SemanticQuery :semanticQuery="semanticQuery" />
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

<template>
  <SemanticQuery :semanticQuery="semanticQuery">
    <span>{{ semanticQuery.query}} - {{ semanticQuery.distance }}</span>
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

```
</docs>
