<template>
  <div class="x-list x-filters-search" :class="cssClasses" data-test="filters-search">
    <!--
      @slot Search content. It is the content which triggers the filters sifting.
        @binding {string} query - The query to search in filters.
        @binding {Function} setQuery - The function to set the query. The query is passed as
        parameter.
        @binding {Function} clearQuery - The function to clear the query.
    -->
    <slot name="search" v-bind="{ query, setQuery, clearQuery }">
      <input
        @input="setQuery($event.target.value)"
        :value="query"
        type="search"
        class="x-input x-filters-search__input"
        data-test="filters-search-input"
        :aria-label="filtersSearchInputMessage"
      />
    </slot>
    <!--
      @slot (Required) Sifted filters content.
        @binding {Filter[]} siftedFilters - Sifted filters data.
    -->
    <slot :siftedFilters="siftedFilters"></slot>
  </div>
</template>

<script lang="ts">
  import { Filter, isBooleanFilter } from '@empathyco/x-types';
  import { mixins } from 'vue-class-component';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { xComponentMixin, XProvide } from '../../../../components';
  import { debounce } from '../../../../utils/debounce';
  import { normalizeString } from '../../../../utils/normalize';
  import { DebouncedFunction, VueCSSClasses } from '../../../../utils/types';
  import { facetsXModule } from '../../x-module';
  import FiltersInjectionMixin from './filters-injection.mixin';

  /**
   * Renders the filters sifted with the input query.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(facetsXModule)]
  })
  export default class FiltersSearch extends mixins(FiltersInjectionMixin) {
    /** The debounce time for applying the filter sifting. */
    @Prop({ default: 200 })
    protected debounceInMs!: number;

    protected query = '';
    protected setQueryDebounced!: DebouncedFunction<[string]>;

    protected filtersSearchInputMessage = 'search into the filter values';

    /**
     * Set the debounce function for setting the query debounced.
     *
     * @internal
     */
    @Watch('debounceInMs', { immediate: true })
    updateSetQueryDebounced(): void {
      this.setQueryDebounced = debounce(query => {
        this.query = query;
      }, this.debounceInMs);
    }

    /**
     * Sift the array of filters which matches with the query.
     *
     * @returns Array of sifted filters.
     * @internal
     */
    @XProvide('filters')
    public get siftedFilters(): Filter[] {
      const normalizedQuery = normalizeString(this.query);
      return this.renderedFilters.filter(
        filter => isBooleanFilter(filter) && normalizeString(filter.label).includes(normalizedQuery)
      );
    }

    /**
     * Adds the dynamic css classes to the component.
     *
     * @returns The class to be added to the component.
     * @internal
     */
    protected get cssClasses(): VueCSSClasses {
      return {
        'x-filters-search--is-sifted': !!this.query
      };
    }

    /**
     * Set the query through the debounced function.
     *
     * @param query - The query to sift filters.
     * @internal
     */
    protected setQuery(query: string): void {
      this.setQueryDebounced(query);
    }

    /**
     * Clear the query.
     *
     * @internal
     */
    protected clearQuery(): void {
      this.query = '';
    }
  }
</script>

<style lang="scss" scoped>
  .x-filters-search__input {
    &::-ms-clear {
      display: none;
      width: 0;
      height: 0;
    }

    &::-ms-reveal {
      display: none;
      width: 0;
      height: 0;
    }

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      display: none;
    }
  }
</style>

<docs lang="mdx">
## Examples

It renders an input and a list of filters passed as prop or being injected. The list of filters can
be sifted with the query typed in the input. This component has also a debounce prop to set the time
in milliseconds to apply the filters search. Moreover, it has two scoped slots. The first one for
customize the search triggering with three slot props; the query, a function to set the query by
sifting and a third one for cleaning the query. The second scoped slot is required and it is for
displaying the list of filters sifted. It has a slot prop with these filters sifted.

### Important

The component has two ways of receive the filters list, it can be injected by another component or
be send it as a prop. If the component doesnt have a parent component that receive and exposed a
filters list to their children, it is mandatory to send it as prop.

### Basic usage

Using default and required slot:

```vue
<FiltersSearch :filters="filters" v-slot="{ siftedFilters }">
  <ul v-for="filter in siftedFilters">
    <li :key="filter.id">{{ filter.label }}</li>
  </ul>
</FiltersSearch>
```

Setting debounce time:

```vue
<FiltersSearch :filters="filters" :debounceInMs="500" v-slot="{ siftedFilters }">
  <ul v-for="filter in siftedFilters">
    <li :key="filter.id">{{ filter.label }}</li>
  </ul>
</FiltersSearch>
```

Replacing search triggering:

```vue
<FiltersSearch :filters="filters">
  <template #search="{ query, setQuery, clearQuery }">
    <input
      @input="setQuery($event.target.value)"
      :value="query"
      class="x-input x-filters-search__input"
      :aria-label="filtersSearchInputMessage"/>
    <button @click="clearQuery">X</button>
  </template>
  <template #default="{ siftedFilters }">
    <ul v-for="filter in siftedFilters">
      <li :key="filter.id">{{ filter.label }}</li>
    </ul>
  </template>
</FiltersSearch>
```

> **Using injection**: It can receive the filters list by injection. It only works if it has a
> parent component that receives and exposes the filters list. Using the injection, It is not
> necessary to send the prop to the child components, it has to be send it in the parent component,
> the rest of components will inject this list.

```vue
<Facets v-slot="{ facet }">
  <SlicedFilters :filters="facet.filters" :max="8">
    <FiltersSearch >
        <Filters v-slot="{ filter }">
          <SimpleFilter :filter="filter" data-test="brand-filter" />
        </Filters>
    </FiltersSearch>
  </SlicedFilters>
</Facets>
```
</docs>
