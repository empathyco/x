<template>
  <article class="x-result" style="max-width: 300px; overflow: hidden">
    <BaseResultLink :result="result">
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
      <BaseResultAddToCart :result="result" data-test="add-to-cart">
        <span>Add to cart</span>
      </BaseResultAddToCart>
    </div>
    <div class="x-result__description">
      <BaseResultRating :result="result" :max="5" link="#" class="x-text1 x-text1-sm">
        <template #filled-icon>❤️</template>
        <template #empty-icon>🤍</template>
      </BaseResultRating>
      <BaseResultLink :result="result">
        <h1 class="x-text1 x-text1-lg" data-test="result-title">{{ result.name }}</h1>
      </BaseResultLink>
    </div>
  </article>
</template>

<script lang="ts">
import type { Result } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import CrossFade from '../../components/animations/cross-fade.vue'
import BaseResultAddToCart from '../../components/result/base-result-add-to-cart.vue'
import BaseResultImage from '../../components/result/base-result-image.vue'
import BaseResultLink from '../../components/result/base-result-link.vue'
import BaseResultRating from '../../components/result/base-result-rating.vue'

export default defineComponent({
  name: 'Result',
  components: {
    BaseResultAddToCart,
    BaseResultLink,
    BaseResultRating,
    BaseResultImage,
  },
  props: {
    result: {
      type: Object as PropType<Result>,
      required: true,
    },
  },
  setup() {
    return {
      crossFade: CrossFade,
    }
  },
})
</script>
