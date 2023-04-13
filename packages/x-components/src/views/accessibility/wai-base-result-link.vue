<template>
  <article class="x-result" style="max-width: 300px; overflow: hidden">
    <BaseResultLink class="x-result__picture" :result="result">
      <BaseResultImage :result="result" class="x-picture-zoom"></BaseResultImage>
    </BaseResultLink>

    <BaseResultLink class="x-result__description x-list x-flex-col x-gap-4" :result="result">
      <h2 class="x-small x-ellipsis x-uppercase" data-test="result-title">
        {{ result.name }}
      </h2>
      <div class="x-list x-list--wrap x-gap-8">
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
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { createResultStub } from '../../__stubs__';
  import BaseResultLink from '../../components/result/base-result-link.vue';
  import BaseResultImage from '../../components/result/base-result-image.vue';
  import BaseResultCurrentPrice from '../../components/result/base-result-current-price.vue';
  import BaseResultPreviousPrice from '../../components/result/base-result-previous-price.vue';

  @Component({
    components: {
      BaseResultCurrentPrice,
      BaseResultPreviousPrice,
      BaseResultImage,
      BaseResultLink
    }
  })
  export default class AccessibilityCheck extends Vue {
    protected result = createResultStub('Demo result', {
      images: ['https://picsum.photos/seed/5/100/100'],
      price: {
        hasDiscount: false,
        originalValue: 11.99,
        value: 11.99
      },
      url: 'https://www.lolahome.es/escobilla-zen-ceramica-blanco-gris-29075'
    });
  }
</script>
