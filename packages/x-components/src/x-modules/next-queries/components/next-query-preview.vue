<template>
  <ul v-if="suggestionResults" data-test="next-query-preview" class="x-next-query-preview">
    <!--
      @slot Next Query Preview default slot.
          @binding {NextQuery} suggestion - Next Query suggestion data
          @binding {Result[]} results - The results preview of the next query
          @binding {number} totalResults - The total results of the search request
    -->
    <slot
      :suggestion="suggestion"
      :results="suggestionResults.items"
      :totalResults="suggestionResults.totalResults"
    >
      <li
        v-for="result in suggestionResults.items"
        :key="result.id"
        class="x-next-query-preview__item"
        data-test="next-query-preview-item"
      >
        <!--
          @slot Next Query Preview result slot.
              @binding {Result} result - A Next Query Preview result
        -->
        <slot name="result" :result="result">
          <span data-test="result-name">{{ result.name }}</span>
        </slot>
      </li>
    </slot>
  </ul>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { NextQuery, PreviewResults } from '@empathyco/x-types';
  import { Dictionary } from '@empathyco/x-utils';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { nextQueriesXModule } from '../x-module';
  import { State } from '../../../components/decorators/store.decorators';

  /**
   * Retrieves a preview of the results of a next query and exposes them in the default slot,
   * along with the next query and the totalResults of the search request.
   * By default, it renders the names of the results.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(nextQueriesXModule)]
  })
  export default class NextQueryPreview extends Vue {
    /**
     * The next query to retrieve the results preview.
     *
     * @public
     */
    @Prop({
      required: true
    })
    protected suggestion!: NextQuery;

    /**
     * Number of suggestion results to be rendered.
     *
     * @public
     */
    @Prop()
    protected maxItemsToRender?: number;

    /**
     * The results preview of the next queries mounted.
     * It is a dictionary, indexed by the next query query.
     */
    @State('nextQueries', 'resultsPreview')
    public previewResults!: Dictionary<PreviewResults>;

    /**
     * The component emits the NextQueryPreviewMounted event to retrieve the results preview
     * of the next query.
     */
    mounted(): void {
      this.$x.emit('NextQueryPreviewMounted', this.suggestion.query);
    }

    /**
     * Gets from the state the results preview of the next query.
     *
     * @returns The results preview of the actual next query.
     */
    public get suggestionResults(): PreviewResults | undefined {
      const previewResults = this.previewResults[this.suggestion.query];

      return previewResults
        ? {
            ...previewResults,
            items: previewResults.items.slice(0, this.maxItemsToRender)
          }
        : undefined;
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits the `NextQueryPreviewMounted` when it is mounted.

## See it in action

Here you have a basic example of how the NextQueryPreview is rendered. Keep in mind that this
component is intended to be used overriding its default slot. By default it will only render the
names of the results.

```vue live
<template>
  <NextQueryPreview :suggestion="suggestion" />
</template>

<script>
  import { NextQueryPreview } from '@empathyco/x-components/next-queries';

  export default {
    name: 'NextQueryPreviewDemo',
    components: {
      NextQueryPreview
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

### Play with the default slot

In this example, the results will be rendered inside a sliding panel.

```vue live
<template>
  <NextQueryPreview :suggestion="suggestion" #default="{ totalResults, results }">
    <p>Total results: {{ totalResults }}</p>
    <SlidingPanel :resetOnContentChange="false">
      <article
        v-for="result in results"
        :key="result.id"
        class="x-result"
        style="max-width: 300px; overflow: hidden"
      >
        <BaseResultLink :result="result">
          <BaseResultImage :result="result" class="x-result__picture" />
        </BaseResultLink>
        <div class="x-result__description">
          <BaseResultLink :result="result">
            <h1 class="x-title3">{{ result.name }}</h1>
          </BaseResultLink>
        </div>
      </article>
    </SlidingPanel>
  </NextQueryPreview>
</template>

<script>
  import { NextQueryPreview } from '@empathyco/x-components/next-queries';
  import { SlidingPanel, BaseResultLink, BaseResultImage } from '@empathyco/x-components';

  export default {
    name: 'NextQueryPreviewDemoOverridingSlot',
    components: {
      NextQueryPreview,
      SlidingPanel,
      BaseResultLink,
      BaseResultImage
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

### Play with the result slot

The component exposes a slot to override the result content, without modifying the list.

In this example, the ID of the results will be rendered along with the name.

```vue
<template>
  <NextQueryPreview :suggestion="suggestion" #result="{ result }">
    <span>{{ result.id }}</span>
    <span>{{ result.name }}</span>
  </NextQueryPreview>
</template>

<script>
  import { NextQueryPreview } from '@empathyco/x-components/next-queries';

  export default {
    name: 'NextQueryPreviewDemoOverridingResultSlot',
    components: {
      NextQueryPreview
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

### Play with props

In this example, the suggestions has been limited to render a maximum of 4 items.

```vue
<template>
  <NextQueryPreview
    :maxItemsToRender="maxItemsToRender"
    :suggestion="suggestion"
    #default="{ results }"
  >
    <BaseGrid #default="{ item }" :items="results">
      <BaseResultLink :result="item">
        <BaseResultImage :result="item" />
      </BaseResultLink>
    </BaseGrid>
  </NextQueryPreview>
</template>

<script>
  import { BaseGrid, BaseResultImage, BaseResultLink } from '@empathyco/x-components';
  import { NextQueryPreview } from '@empathyco/x-components/next-queries';

  export default {
    name: 'NextQueryPreviewDemo',
    components: {
      BaseGrid,
      BaseResultImage,
      BaseResultLink,
      NextQueryPreview
    },
    data() {
      return {
        maxItemsToRender: 4,
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
</docs>
