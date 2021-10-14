<template>
  <component
    :is="animation"
    v-if="partialResults.length"
    class="x-list x-partial-results-list"
    data-test="partial-results"
    tag="ul"
  >
    <li
      v-for="(partialResult, index) in partialResults"
      :key="`${partialResult.query}-${index}`"
      class="x-partial-result"
      data-test="partial-result"
    >
      <!--
       @slot (Required) Partial results item content
           @binding {Partial} partialResult - Partial Result data
      -->
      <slot :partialResult="partialResult" />
    </li>
  </component>
</template>

<script lang="ts">
  import { PartialResult } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { searchXModule } from '../x-module';

  /**
   * It renders a list of partial results from {@link SearchState.partialResults} by default.
   * It also provides the partial result slot to customize the item with the partial result bound.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class PartialResultsList extends Vue {
    /**
     * Animation component that will be used to animate the partial results.
     *
     * @public
     */
    @Prop({ default: 'ul' })
    protected animation!: Vue | string;
    /**
     * The partials results from the search state.
     *
     * @public
     */
    @State('search', 'partialResults')
    public items!: PartialResult[];
    /**
     * Maximum number of partial results to show.
     *
     * @public
     */
    @Prop({ default: 5 })
    protected maxItemsToRender!: number;
    /**
     * A limited number of partial results.
     *
     * @returns The partial results sliced by the maxItemsToRender.
     *
     * @internal
     */
    protected get partialResults(): PartialResult[] {
      return this.items.slice(0, this.maxItemsToRender);
    }
  }
</script>

<style lang="scss" scoped>
  .x-partial-results {
    list-style-type: none;
    padding: 0;
  }
</style>

<docs lang="mdx">
#Examples

This component loops through an array of partials an exposed a slot to use customize each partial.

## Basic example

It renders a list of partial results using the default slot:

```vue
<template>
  <PartialResultsList>
    <template #default="{ partialResult }">
      <ResultsList :results="partialResult.results" />
    </template>
  </PartialResultsList>
</template>
```

## Configuring the number of partials

It sets the maximum partials to show to 3.

```vue
<template>
  <PartialResultsList :maxItemsToRender="3">
    <template #default="{ partialResult }">
      <ResultsList :results="partialResult.results" />
    </template>
  </PartialResultsList>
</template>
```

## Rendering usage

It renders a list of partial results using the default slot. It will show the query, the partial
results and a button to update the query with the partial one.

```vue
<template>
  <PartialResultsList>
    <template #default="{ partialResult }">
      <span>{{ partialResult.query }}</span>
      <BaseGrid :columns="4" :items="partialResult.results">
        <template #result="{ item }">
          <BaseResultLink :result="item">
            <template #default="{ item }">
              <BaseResultImage :result="item" />
              <span class="x-result__title">{{ item.name }}</span>
            </template>
          </BaseResultLink>
        </template>
      </BaseGrid>
      <PartialQueryButton :query="partialResult.query">
        <template #default="{ query }">Ver todos {{ query }}</template>
      </PartialQueryButton>
    </template>
  </PartialResultsList>
</template>
```
</docs>
