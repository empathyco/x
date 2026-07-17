<template>
  <Banner
    ref="banner"
    :banner="banner"
    :click-event="banner.modelName === 'VendorBanner' ? 'UserClickedAVendorBanner' : undefined"
  />
</template>

<script setup lang="ts">
import type { Banner as BannerModel } from '@empathyco/x-types'
import type { VendorBanner } from '@x/x-modules/vendor'
import type { PropType } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { useXBus } from '@x/composables'
import { Banner } from '@x/x-modules/search'
import { useTemplateRef, watch } from 'vue'
const props = defineProps({
  banner: {
    type: Object as PropType<BannerModel>,
    required: true,
  },
})

const { emit } = useXBus()
const bannerRef = useTemplateRef('banner')
const isVisible = useElementVisibility(bannerRef, { once: true })

watch(isVisible, visible => {
  if (visible && props.banner.modelName === 'VendorBanner') {
    setTimeout(
      () => emit('UserViewedAVendorBanner', props.banner as VendorBanner),
      Math.random() * 1000, // Simulate delay since multiple emits of the same event at the same time are cancelling some of them
    )
  }
})
</script>
