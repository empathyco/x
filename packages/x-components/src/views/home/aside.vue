<template>
  <div class="xds:flex xds:flex-col xds:gap-24">
    <FacetsProvider :facets="staticFacets" group-id="price" />
    <ClearFilters />
    <SelectedFiltersList>
      <template #default="{ filter }">
        <SimpleFilter :filter="filter" :css-classes="['xds:facet-filter-success']">
          <template #label>{{ filter.label ?? filter.id }}</template>
        </SimpleFilter>
      </template>
    </SelectedFiltersList>

    <!-- Facets -->
    <Facets class="gap-24">
      <!--  Editable Number Price Range Facet    -->
      <template #editable-number-range-facet="{ facet }">
        <BaseHeaderTogglePanel
          :data-test="facet.label"
          class="xds:border-0 xds:border-b xds:border-neutral-10"
        >
          <template #header-content>
            <span :data-test="facet.label" class="xds:truncate">{{ facet.label }}</span>
            <ChevronDown />
          </template>
          <!-- Filters -->
          <EditableNumberPriceRangeFilter :filter="facet.filters[0]" />
        </BaseHeaderTogglePanel>
      </template>

      <!--  Hierarchical Facet    -->
      <template #hierarchical-facet="{ facet }">
        <BaseHeaderTogglePanel header-class="xds:w-full xds:flex xds:justify-between xds:py-8">
          <template #header-content>
            <span class="xds:truncate">{{ facet.label }}</span>
            <ChevronDown />
          </template>
          <!-- Filters -->
          <SlicedFilters :max="4" :filters="facet.filters">
            <FiltersList v-slot="{ filter }">
              <HierarchicalFilter
                :filter="filter"
                :data-test="`${facet.label}-filter`"
                children-filters-class="xds:ml-16"
              />
            </FiltersList>
          </SlicedFilters>
        </BaseHeaderTogglePanel>
      </template>

      <!--  Range Facet    -->
      <template #number-range-facet="{ facet }">
        <BaseHeaderTogglePanel header-class="xds:w-full xds:flex xds:justify-between xds:py-8">
          <template #header-content>
            <span :data-test="facet.label" class="xds:truncate">{{ facet.label }}</span>
            <ChevronDown />
          </template>
          <!-- Filters -->
          <ExcludeFiltersWithNoResults :filters="facet.filters">
            <SortedFilters>
              <SlicedFilters
                :max="controls.slicedFilters.max"
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
        <BaseHeaderTogglePanel header-class="xds:w-full xds:flex xds:py-8 xds:gap-8">
          <template #header-content>
            <span :data-test="facet.label" class="xds:truncate">{{ facet.label }}</span>
            <span data-test="total-filters">{{ facet.filters.length }}</span>
            <ChevronDown class="xds:ml-auto" />
          </template>

          <!-- Filters -->
          <ExcludeFiltersWithNoResults :filters="facet.filters">
            <SortedFilters>
              <FiltersSearch :data-test="`filters-search-${facet.id}`">
                <SlicedFilters
                  :max="controls.slicedFilters.max"
                  :data-test="`${facet.label}-sliced-filters`"
                >
                  <FiltersList
                    v-slot="{
                      // eslint-disable-next-line vue/no-unused-vars
                      filter,
                    }"
                  >
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
  EditableNumberRangeFilter,
  Facet,
  SimpleFilter as SimpleFilterModel,
} from '@empathyco/x-types'
import type { Ref } from 'vue'
import type { HomeControls } from './types'
import { defineComponent, inject } from 'vue'
import BasePriceFilterLabel from '../../components/filters/labels/base-price-filter-label.vue'
import ChevronDown from '../../components/icons/chevron-down.vue'
import BaseHeaderTogglePanel from '../../components/panels/base-header-toggle-panel.vue'
import ClearFilters from '../../x-modules/facets/components/clear-filters.vue'
import FacetsProvider from '../../x-modules/facets/components/facets/facets-provider.vue'
import Facets from '../../x-modules/facets/components/facets/facets.vue'
import EditableNumberPriceRangeFilter from '../../x-modules/facets/components/filters/editable-number-range-filter.vue'
import HierarchicalFilter from '../../x-modules/facets/components/filters/hierarchical-filter.vue'
import SimpleFilter from '../../x-modules/facets/components/filters/simple-filter.vue'
import ExcludeFiltersWithNoResults from '../../x-modules/facets/components/lists/exclude-filters-with-no-results.vue'
import FiltersList from '../../x-modules/facets/components/lists/filters-list.vue'
import FiltersSearch from '../../x-modules/facets/components/lists/filters-search.vue'
import SelectedFiltersList from '../../x-modules/facets/components/lists/selected-filters-list.vue'
import SelectedFilters from '../../x-modules/facets/components/lists/selected-filters.vue'
import SlicedFilters from '../../x-modules/facets/components/lists/sliced-filters.vue'
import SortedFilters from '../../x-modules/facets/components/lists/sorted-filters.vue'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Aside',
  components: {
    BaseHeaderTogglePanel,
    BasePriceFilterLabel,
    ChevronDown,
    ClearFilters,
    EditableNumberPriceRangeFilter,
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
    const controls = inject<Ref<HomeControls>>('controls')?.value
    const editableNumberRangeFilter: EditableNumberRangeFilter = {
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
