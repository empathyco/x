<template>
  <article style="max-width: 300px; overflow: hidden">
    <BaseResultLink :result="result">
      <BaseResultImage :result="result" class="x-picture-zoom"></BaseResultImage>
    </BaseResultLink>

    <BaseResultLink class="xds:flex xds:flex-col xds:gap-4" :result="result">
      <h2 class="small ellipsis uppercase" data-test="result-title">
        {{ result.name }}
      </h2>
      <div class="x-list x-list--horizontal x-list--wrap x-list--gap-03">
        <BaseResultCurrentPrice :result="result" class="x-text x-text--bold" />
        <BaseResultPreviousPrice
          :result="result"
          class="x-text x-text--secondary x-text--light x-text--stroke"
        />
      </div>
    </BaseResultLink>
  </article>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { createResultStub } from '../../__stubs__'
import BaseResultCurrentPrice from '../../components/result/base-result-current-price.vue'
import BaseResultImage from '../../components/result/base-result-image.vue'
import BaseResultLink from '../../components/result/base-result-link.vue'
import BaseResultPreviousPrice from '../../components/result/base-result-previous-price.vue'

export default defineComponent({
  name: 'AccessibilityCheck',
  components: {
    BaseResultCurrentPrice,
    BaseResultPreviousPrice,
    BaseResultImage,
    BaseResultLink,
  },
  setup() {
    return {
      result: createResultStub('Demo result', {
        images: ['https://picsum.photos/seed/5/100/100'],
        price: {
          hasDiscount: false,
          originalValue: 11.99,
          futureValue: 11.99,
          value: 11.99,
        },
        url: 'https://www.lolahome.es/escobilla-zen-ceramica-blanco-gris-29075',
      }),
    }
  },
})
</script>
