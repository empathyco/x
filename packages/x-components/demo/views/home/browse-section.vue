<template>
  <div>
    <hr class="xds:mt-10 xds:text-neutral-25" />
    <h1 class="xds:text-4xl xds:leading-normal xds:font-bold">Browse test</h1>
    <div class="xds:flex xds:gap-8">
      <div class="xds:text-lg xds:font-semibold">Browse to...</div>
      <button
        class="xds:button"
        onclick="
          window.InterfaceX?.browse({ browseField: 'categoryIds', browseValue: '5b612edb5' })
        "
      >
        CategoryIds > dress
      </button>
      <button
        class="xds:button"
        onclick="
          window.InterfaceX?.browse({
            browseField: 'description',
            browseValue: 'floral print dress',
          })
        "
      >
        Description > floral print dress
      </button>
      <CloseMainModal class="xds:mr-64 xds:ml-auto xds:button xds:button-circle">
        <CrossIcon />
      </CloseMainModal>
    </div>
  </div>
  <div class="xds:layout-item xds:layout-expand xds:layout-no-margin-right">
    <BrowseSortPickerList
      v-show="x.browseTotalResults > 0"
      v-slot="{ item }"
      :items="['', 'price asc', 'price desc']"
      class="xds:mt-24 xds:button-group xds:pl-24"
      button-class="xds:button xds:button-outlined"
    >
      {{ item || 'default' }}
    </BrowseSortPickerList>

    <div class="xds:flex xds:layout-expand xds:px-24 xds:pt-12">
      <!-- ASIDE -->
      <BaseIdTogglePanel
        v-show="x.browseTotalResults > 0"
        panel-id="aside-panel"
        :animation="asideAnimation"
        class="xds:w-1/5"
      >
        <Scroll id="aside-scroll" class="xds:h-full">
          <FacetsAside :controls="controls" />
        </Scroll>
      </BaseIdTogglePanel>

      <LocationProvider location="results">
        <BrowseResultsList v-infinite-scroll:main-scroll="{ margin: 600 }" data-wysiwyg="results">
          <BaseVariableColumnGrid
            style="--x-size-min-width-grid-item: 150px"
            class="xds:gap-12"
            :animation="staggeredFadeAndSlideAnimation"
            :columns="x.device === 'mobile' ? 2 : 4"
          >
            <template #result="{ item: result }">
              <MainScrollItem :item="result">
                <Result :result="result" />
              </MainScrollItem>
            </template>
          </BaseVariableColumnGrid>
        </BrowseResultsList>
      </LocationProvider>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'
import type { HomeControls } from './types'
import {
  AnimateWidth,
  BaseIdTogglePanel,
  BaseVariableColumnGrid,
  CloseMainModal,
  CrossIcon,
  LocationProvider,
  StaggeredFadeAndSlide,
} from '@x/components'
import { use$x } from '@x/composables/index'
import { infiniteScroll } from '@x/directives/index'
import { BrowseResultsList, BrowseSortPickerList } from '@x/x-modules/browse/index'
import { MainScrollItem } from '@x/x-modules/scroll/index'
import Scroll from '../../../src/x-modules/scroll/components/scroll.vue'
import FacetsAside from './facets-aside.vue'
import Result from './result.vue'

defineProps({
  controls: {
    type: Object as PropType<HomeControls>,
    required: true,
  },
})

const staggeredFadeAndSlideAnimation = StaggeredFadeAndSlide
const asideAnimation = AnimateWidth
const vInfiniteScroll = infiniteScroll

const x = use$x()
</script>
