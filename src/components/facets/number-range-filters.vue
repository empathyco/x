<template>
  <Filters v-slot="{ filter }" :filters="filters" :animation="staggeredFadeAndSlide">
    <NumberRangeFilter :filter="filter">
      <template #default="{ filter }">
        <BasePriceFilterLabel
          :filter="filter"
          :configCurrency="{ format: 'i €' }"
          lessThan="Less than {max}"
          fromTo="From {min} to {max}"
          from="More than {min}"
        />
      </template>
    </NumberRangeFilter>
  </Filters>
</template>

<script lang="ts">
  import { Filter } from '@empathy/search-types';
  import { BasePriceFilterLabel, StaggeredFadeAndSlide } from '@empathy/x-components';
  import { NumberRangeFilter, Filters } from '@empathy/x-components/facets';
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component({
    components: {
      Filters,
      BasePriceFilterLabel,
      NumberRangeFilter,
      StaggeredFadeAndSlide
    }
  })
  export default class NumberRangeFilters extends Vue {
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;

    @Prop()
    protected filters!: Filter[];
  }
</script>
