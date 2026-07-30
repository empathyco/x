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
import { computed, onMounted, useTemplateRef, watch } from 'vue'
const props = defineProps({
  banner: {
    type: Object as PropType<BannerModel>,
    required: true,
  },
})

const { emit } = useXBus()

const isVendorBanner = computed(() => props.banner.modelName === 'VendorBanner')

if (isVendorBanner.value) {
  onMounted(() => {
    emit('VendorBannerMounted', props.banner as VendorBanner)
  })
  const bannerRef = useTemplateRef('banner')
  const isVisible = useElementVisibility(bannerRef, { once: true })
  watch(isVisible, async visible => {
    visible && (await emit('UserViewedAVendorBanner', props.banner as VendorBanner))
  })
}
</script>
