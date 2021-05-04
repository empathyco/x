<template>
  <BaseHeaderTogglePanel :startCollapsed="true" :animation="collapseFromTop">
    <template #header-content>
      {{ $t(`facets.${facet.label}`) }}
      <SelectedFilters :facetId="facet.id" />
    </template>
    <slot />
  </BaseHeaderTogglePanel>
</template>

<script lang="ts">
  import { Facet } from '@empathy/search-types';
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { BaseHeaderTogglePanel, CollapseFromTop } from '@empathy/x-components';
  import { SelectedFilters } from '@empathy/x-components/facets';

  @Component({
    components: {
      BaseHeaderTogglePanel,
      SelectedFilters
    }
  })
  export default class FacetComponent extends Vue {
    public collapseFromTop = CollapseFromTop;

    @Prop()
    public facet?: Facet;
  }
</script>
