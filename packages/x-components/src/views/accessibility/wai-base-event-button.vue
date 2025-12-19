<template>
  <Scroll id="accessibility-scroll">
    <section class="flex flex-col gap-16 p-32">
      <div>
        <h1>BaseIdTogglePanelButton</h1>
        <BaseIdTogglePanelButton class="x-button--ghost x-button" :panel-id="panelId">
          Panel
        </BaseIdTogglePanelButton>
        <BaseIdTogglePanel :start-open="true" panel-id="aside-panel">
          <div class="x-text1">Hey there!</div>
        </BaseIdTogglePanel>

        <BaseIdTogglePanelButton class="x-button--ghost x-button" panel-id="panel2" />
        <BaseIdTogglePanel :start-open="true" panel-id="aside-panel">
          <div class="x-text1">
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
        <BaseResultAddToCart :result="{ id: 1, modelName: 'Result' }">
          <img src="https://picsum.photos/seed/200/50/50" alt="Add to cart" />
        </BaseResultAddToCart>
      </div>

      <div>
        <h1>AllFilter & ClearFilters</h1>
        <FacetsProvider :facets="[facet]" />
        <Facets>
          <template #default="{ facet: facetBinding }">
            <AllFilter :facet="facetBinding">
              {{ facetBinding.label }}
            </AllFilter>
            <Filters v-slot="{ filter }" :filters="facetBinding.filters">
              <SimpleFilter :filter="filter" />
            </Filters>
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
        <ScrollToTop scroll-id="accessibility-scroll" :threshold-px="1000">
          <span>^</span>
        </ScrollToTop>
      </div>
    </section>
  </Scroll>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getSimpleFacetStub } from '../../__stubs__'
import BaseColumnPickerList from '../../components/column-picker/base-column-picker-list.vue'
import BaseEventsModalClose from '../../components/modals/base-events-modal-close.vue'
import BaseEventsModalOpen from '../../components/modals/base-events-modal-open.vue'
import BaseEventsModal from '../../components/modals/base-events-modal.vue'
import BaseIdTogglePanelButton from '../../components/panels/base-id-toggle-panel-button.vue'
import BaseIdTogglePanel from '../../components/panels/base-id-toggle-panel.vue'
import BaseResultAddToCart from '../../components/result/base-result-add-to-cart.vue'
import ClearFilters from '../../x-modules/facets/components/clear-filters.vue'
import FacetsProvider from '../../x-modules/facets/components/facets/facets-provider.vue'
import Facets from '../../x-modules/facets/components/facets/facets.vue'
import AllFilter from '../../x-modules/facets/components/filters/all-filter.vue'
import SimpleFilter from '../../x-modules/facets/components/filters/simple-filter.vue'
import Filters from '../../x-modules/facets/components/lists/filters-list.vue'

import ClearHistoryQueries from '../../x-modules/history-queries/components/clear-history-queries.vue'
import HistoryQueries from '../../x-modules/history-queries/components/history-queries.vue'
import ScrollToTop from '../../x-modules/scroll/components/scroll-to-top.vue'
import Scroll from '../../x-modules/scroll/components/scroll.vue'
import SearchInput from '../../x-modules/search-box/components/search-input.vue'

export default defineComponent({
  name: 'AccessibilityCheck',
  components: {
    BaseEventsModal,
    BaseEventsModalClose,
    BaseEventsModalOpen,
    BaseIdTogglePanel,
    BaseIdTogglePanelButton,
    BaseResultAddToCart,
    BaseColumnPickerList,
    ClearFilters,
    ClearHistoryQueries,
    Facets,
    Filters,
    HistoryQueries,
    ScrollToTop,
    Scroll,
    SearchInput,
    SimpleFilter,
    FacetsProvider,
    AllFilter,
  },
  setup() {
    return {
      facet: getSimpleFacetStub(),
      panelId: 'aside-panel',
    }
  },
})
</script>

<style lang="css" scoped>
.x-scroll {
  height: 600px;
}
</style>
