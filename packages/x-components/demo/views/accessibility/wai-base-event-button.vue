<template>
  <Scroll id="accessibility-scroll">
    <section class="xds:flex xds:flex-col xds:gap-16 xds:p-32">
      <div>
        <h1>BaseIdTogglePanelButton</h1>
        <BaseIdTogglePanelButton class="xds:button xds:button-ghost" :panel-id="panelId">
          Panel
        </BaseIdTogglePanelButton>
        <BaseIdTogglePanel :start-open="true" panel-id="aside-panel">
          <div class="xds:text1">Hey there!</div>
        </BaseIdTogglePanel>

        <BaseIdTogglePanelButton class="xds:button xds:button-ghost" panel-id="panel2" />
        <BaseIdTogglePanel :start-open="true" panel-id="aside-panel">
          <div class="xds:text1">
            Button without text, an element should have the ID to make it accessible.
          </div>
        </BaseIdTogglePanel>
      </div>

      <div>
        <h1>ClearHistoryQueries and RemoveHistoryQuery</h1>
        <SearchInput />
        <ClearHistoryQueries>Not reading this since there is an aria-label</ClearHistoryQueries>
        <HistoryQueries :max-items-to-render="3" />
      </div>

      <div>
        <h1>BaseResultAddToCart</h1>
        <BaseAddToCart :result="{ id: 1, modelName: 'Result' }">
          <img src="https://picsum.photos/seed/200/50/50" alt="Add to cart" />
        </BaseAddToCart>
      </div>

      <div>
        <h1>AllFilter & ClearFilters</h1>
        <FacetsProvider :facets="[facet]" />
        <Facets>
          <template #default="{ facet: facetBinding }">
            <AllFilter :facet="facetBinding">
              {{ facetBinding.label }}
            </AllFilter>
            <FiltersList v-slot="{ filter }" :filters="facetBinding.filters">
              <SimpleFilter :filter="filter" />
            </FiltersList>
          </template>
        </Facets>
        <ClearFilters />
      </div>

      <div>
        <h1>BaseColumnPickerList</h1>
        <BaseColumnPickerList v-slot="{ column }" :columns="[2, 4, 6]">
          <span>Not reading this since there is an aria-label {{ column }}</span>
        </BaseColumnPickerList>
      </div>

      <div>
        <h1>BaseEventsModalOpen and BaseEventsModalClose</h1>
        <BaseEventsModalOpen>This button opens the modal</BaseEventsModalOpen>
        <BaseEventsModal>
          <BaseEventsModalClose>This button closes the modal</BaseEventsModalClose>
        </BaseEventsModal>
      </div>

      <h1>ScrollToTop</h1>
      <div>
        <ScrollToTop class="xds:button-circle" scroll-id="accessibility-scroll" :threshold-px="500">
          <span>^</span>
        </ScrollToTop>
      </div>
    </section>
  </Scroll>
</template>

<script lang="ts" setup>
import { getSimpleFacetStub } from '@x/__stubs__'
import {
  BaseAddToCart,
  BaseColumnPickerList,
  BaseEventsModal,
  BaseEventsModalClose,
  BaseEventsModalOpen,
  BaseIdTogglePanel,
  BaseIdTogglePanelButton,
} from '@x/components'
import {
  AllFilter,
  ClearFilters,
  Facets,
  FacetsProvider,
  FiltersList,
  SimpleFilter,
} from '@x/x-modules/facets'
import { ClearHistoryQueries, HistoryQueries } from '@x/x-modules/history-queries'
import { Scroll, ScrollToTop } from '@x/x-modules/scroll'
import { SearchInput } from '@x/x-modules/search-box'

const facet = getSimpleFacetStub()
const panelId = 'aside-panel'
</script>

<style lang="css" scoped>
.xds\:scroll {
  height: 600px;
}
</style>
