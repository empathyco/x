<template>
  <article ref="result" class="x-result" style="max-width: 300px; overflow: hidden">
    <BaseResultLink :result="result" :click-event="events?.click">
      <BaseResultImage :result="result" :load-animation="crossFade">
        <template #placeholder>
          <div style="padding-top: 100%; background-color: lightgray"></div>
        </template>
        <template #fallback>
          <div
            data-test="result-picture-fallback"
            style="padding-top: 100%; background-color: lightsalmon"
          ></div>
        </template>
      </BaseResultImage>
    </BaseResultLink>
    <div>
      <BaseAddToCart :result="result" :click-event="events?.addToCart" data-test="add-to-cart">
        <span>Add to cart</span>
      </BaseAddToCart>
    </div>
    <BaseResultCurrentPrice :result="result" />
    <div class="x-result__description">
      <BaseResultRating :result="result" :max="5" link="#" class="xds:text1 xds:text1-sm">
        <template #filled-icon>❤️</template>
        <template #empty-icon>🤍</template>
      </BaseResultRating>
      <BaseResultLink :result="result" :click-event="events?.click">
        <h1 class="xds:text1 xds:text1-lg" data-test="result-title">{{ result.name }}</h1>
      </BaseResultLink>
    </div>
  </article>
</template>

<script lang="ts" setup>
import type { Result } from '@empathyco/x-types'
import type { XEvent } from '@x/wiring'
import type { VendorResult } from '@x/x-modules/vendor'
import type { PropType } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { BaseResultCurrentPrice, CrossFade } from '@x/components'
import {
  BaseAddToCart,
  BaseResultImage,
  BaseResultLink,
  BaseResultRating,
} from '@x/components/result'
import { useXBus } from '@x/composables'
import { computed, useTemplateRef, watch } from 'vue'

const props = defineProps({
  result: {
    type: Object as PropType<Result>,
    required: true,
  },
})
const resultRef = useTemplateRef('result')
const isVisible = useElementVisibility(resultRef, { once: true })
const crossFade = CrossFade
const { emit } = useXBus()

const events = computed<Record<'addToCart' | 'click', XEvent> | undefined>(() => {
  if (props.result.modelName === 'VendorResult') {
    return {
      addToCart: 'UserClickedVendorResultAddToCart',
      click: 'UserClickedAVendorResult',
    }
  }
  return undefined
})

watch(isVisible, visible => {
  if (visible && props.result.modelName === 'VendorResult') {
    setTimeout(
      () => emit('UserViewedAVendorResult', props.result as VendorResult),
      Math.random() * 1000, // Simulate delay since multiple emits of the same event at the same time are cancelling some of them
    )
  }
})
</script>
