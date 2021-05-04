<template>
  <Facets>
    <template #default="{ facet }">
      <Facet :facet="facet">
        <AllFilter :facet="facet" />
        <SlicedFilters :max="8">
          <MultiSelectFilters
            v-slot="{ filter }"
            :animation="staggeredFadeAndSlide"
            :filters="facet.filters"
          >
            <SimpleFilter :filter="filter" />
          </MultiSelectFilters>
        </SlicedFilters>
      </Facet>
    </template>

    <template #brand_facet="{ facet }">
      <Facet :facet="facet">
        <SearchableFilters :filters="facet.filters" />
      </Facet>
    </template>

    <template #price_facet="{ facet }">
      <Facet :facet="facet">
        <NumberRangeFilters :filters="facet.filters" />
      </Facet>
    </template>
  </Facets>
</template>

<script lang="ts">
  import { StaggeredFadeAndSlide } from '@empathy/x-components';
  import {
    SimpleFilter,
    MultiSelectFilters,
    AllFilter,
    Facets
  } from '@empathy/x-components/facets';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import FacetComponent from './facet.vue';
  import SearchableFilters from './searchable-filters.vue';
  import NumberRangeFilters from './number-range-filters.vue';

  @Component({
    components: {
      SearchableFilters,
      StaggeredFadeAndSlide,
      NumberRangeFilters,
      SimpleFilter,
      MultiSelectFilters,
      AllFilter,
      Facets,
      Facet: FacetComponent
    }
  })
  export default class FacetsComponent extends Vue {
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;
  }
</script>
