<template>
  <div class="x-flex x-flex-col x-gap-24">
    <FacetsProvider :facets="staticFacets" group-id="price" />
    <ClearFilters />
    <SelectedFiltersList>
      <template #default="{ filter }">
        <SimpleFilter :filter="filter" :css-classes="['x-facet-filter-success']">
          <template #label>{{ filter.label ?? filter.id }}</template>
        </SimpleFilter>
      </template>
    </SelectedFiltersList>

    <!-- Facets -->
    <Facets class="x-gap-24">
      <!--  Editable Number Price Range Facet    -->
      <template #editable-number-range-facet="{ facet }">
        <BaseHeaderTogglePanel
          :data-test="facet.label"
          class="x-border-0 x-border-b x-border-neutral-10"
        >
          <template #header-content>
            <span :data-test="facet.label" class="x-truncate">{{ facet.label }}</span>
            <ChevronDownIcon />
          </template>
          <!-- Filters -->
          <EditableNumberRangeFilter :filter="facet.filters[0]" />
        </BaseHeaderTogglePanel>
      </template>

      <!--  Hierarchical Facet    -->
      <template #hierarchical-facet="{ facet }">
        <BaseHeaderTogglePanel header-class="x-w-full x-flex x-justify-between x-py-8">
          <template #header-content>
            <span class="x-truncate">{{ facet.label }}</span>
            <ChevronDownIcon />
          </template>
          <!-- Filters -->
          <SlicedFilters :max="4" :filters="facet.filters">
            <FiltersList v-slot="{ filter }">
              <HierarchicalFilter
                :filter="filter"
                :data-test="`${facet.label}-filter`"
                children-filters-class="x-ml-16"
              />
            </FiltersList>
          </SlicedFilters>
        </BaseHeaderTogglePanel>
      </template>

      <!--  Range Facet    -->
      <template #number-range-facet="{ facet }">
        <BaseHeaderTogglePanel header-class="x-w-full x-flex x-justify-between x-py-8">
          <template #header-content>
            <span :data-test="facet.label" class="x-truncate">{{ facet.label }}</span>
            <ChevronDownIcon />
          </template>
          <!-- Filters -->
          <ExcludeFiltersWithNoResults :filters="facet.filters">
            <SortedFilters>
              <SlicedFilters
                :max="controls?.slicedFilters?.max ?? 5"
                :data-test="`${facet.label}-sliced-filters`"
              >
                <SelectedFilters v-slot="{ selectedFilters }" :facets-ids="[facet.id]">
                  <span :data-test="`${facet.label}-selected-filters`">
                    {{ selectedFilters.length }}
                  </span>
                </SelectedFilters>
                <FiltersList v-slot="{ filter }">
                  <SimpleFilter :filter="filter" :data-test="`${facet.label}-filter`">
                    <template #label>
                      <BasePriceFilterLabel
                        v-if="facet.id === 'price'"
                        :filter="filter"
                        format="ii.dd €"
                        less-than="Less than {max}"
                        from-to="From {min} to {max}"
                        from="More than {min}"
                      />
                    </template>
                  </SimpleFilter>
                </FiltersList>
              </SlicedFilters>
            </SortedFilters>
          </ExcludeFiltersWithNoResults>
        </BaseHeaderTogglePanel>
      </template>

      <!--  Default Facet    -->
      <template #default="{ facet }">
        <BaseHeaderTogglePanel header-class="x-w-full x-flex x-py-8 x-gap-8">
          <template #header-content>
            <span :data-test="facet.label" class="x-truncate">{{ facet.label }}</span>
            <span data-test="total-filters">{{ facet.filters.length }}</span>
            <ChevronDownIcon class="x-ml-auto" />
          </template>

          <!-- Filters -->
          <ExcludeFiltersWithNoResults :filters="facet.filters">
            <SortedFilters>
              <FiltersSearch :data-test="`filters-search-${facet.id}`">
                <SlicedFilters
                  :max="controls.slicedFilters.max"
                  :data-test="`${facet.label}-sliced-filters`"
                >
                  <FiltersList v-slot="{ filter }">
                    <SimpleFilter :filter="filter" :data-test="`${facet.label}-filter`">
                      <template #label="{ filter: labelFilter }">
                        {{ labelFilter.label }}
                        <span :data-test="`${facet.label}-filter-total-results`">
                          {{ labelFilter.totalResults }}
                        </span>
                      </template>
                    </SimpleFilter>
                  </FiltersList>
                </SlicedFilters>
              </FiltersSearch>
            </SortedFilters>
          </ExcludeFiltersWithNoResults>
        </BaseHeaderTogglePanel>
      </template>
    </Facets>
  </div>
</template>

<script lang="ts">
import type {
  EditableNumberRangeFacet,
  EditableNumberRangeFilter as EditableNumberRangeFilterModel,
  Facet,
  SimpleFilter as SimpleFilterModel,
} from '@empathyco/x-types'
import type { Ref } from 'vue'
import type { HomeControls } from './types'
import { BaseHeaderTogglePanel, BasePriceFilterLabel, ChevronDownIcon } from '@x/components'
import {
  ClearFilters,
  EditableNumberRangeFilter,
  ExcludeFiltersWithNoResults,
  Facets,
  FacetsProvider,
  FiltersList,
  FiltersSearch,
  HierarchicalFilter,
  SelectedFilters,
  SelectedFiltersList,
  SimpleFilter,
  SlicedFilters,
  SortedFilters,
} from '@x/x-modules/facets'
import { defineComponent, inject } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Aside',
  components: {
    BaseHeaderTogglePanel,
    BasePriceFilterLabel,
    ChevronDownIcon,
    ClearFilters,
    EditableNumberRangeFilter,
    ExcludeFiltersWithNoResults,
    Facets,
    FacetsProvider,
    FiltersList,
    FiltersSearch,
    HierarchicalFilter,
    SimpleFilter,
    SelectedFilters,
    SelectedFiltersList,
    SlicedFilters,
    SortedFilters,
  },
  setup() {
    const controls = inject<Ref<HomeControls>>('controls')!
    const editableNumberRangeFilter: EditableNumberRangeFilterModel = {
      facetId: 'salePrice',
      selected: false,
      id: 'price:0-*',
      modelName: 'EditableNumberRangeFilter',
      range: {
        min: null,
        max: null,
      },
    }
    const staticFacets: Facet[] = [
      {
        modelName: 'SimpleFacet',
        label: 'Offer',
        id: 'offer',
        filters: [
          {
            facetId: 'offer',
            modelName: 'SimpleFilter',
            id: 'price:0-10',
            selected: false,
            label: 'price:0-10',
          } as SimpleFilterModel,
        ],
      },
      {
        modelName: 'EditableNumberRangeFacet',
        label: 'Price range',
        id: 'salePrice',
        filters: [editableNumberRangeFilter],
      } as EditableNumberRangeFacet,
    ]

    return { controls, staticFacets }
  },
})
</script>
