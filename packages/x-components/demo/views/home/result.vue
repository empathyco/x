<template>
  <article class="x-result" style="max-width: 300px; overflow: hidden">
    <BaseResultLink :result="result">
      <BaseResultImage :result="result" :load-animation="crossFace">
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
      <BaseAddToCart :result="result" data-test="add-to-cart">
        <span>Add to cart</span>
      </BaseAddToCart>
    </div>
    <div class="x-result__description">
      <BaseResultRating :result="result" :max="5" link="#" class="xds:text1 xds:text1-sm">
        <template #filled-icon>❤️</template>
        <template #empty-icon>🤍</template>
      </BaseResultRating>
      <BaseResultLink :result="result">
        <h1 class="xds:text1 xds:text1-lg" data-test="result-title">{{ result.name }}</h1>
      </BaseResultLink>
    </div>
  </article>
</template>

<script lang="ts" setup>
import type { Result } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { CrossFade } from '@x/components'
import {
  BaseAddToCart,
  BaseResultImage,
  BaseResultLink,
  BaseResultRating,
} from '@x/components/result'

defineProps({
  result: {
    type: Object as PropType<Result>,
    required: true,
  },
})
const crossFace = CrossFade
</script>
