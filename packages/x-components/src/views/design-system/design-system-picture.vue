<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Picture</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-picture-show-case">
      <h2 class="x-title2">Default</h2>
      <picture class="x-picture">
        <img class="x-picture__image" :src="standardImageUrl" :alt="defaultImageMessage" />
      </picture>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-picture-show-case">
      <h2 class="x-title2">Card</h2>
      <picture class="x-picture x-picture--card">
        <img class="x-picture__image" :src="standardImageUrl" :alt="cardImageMessage" />
      </picture>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-picture-show-case">
      <h2 class="x-title2">Cover</h2>
      <picture class="x-picture x-picture--cover">
        <img class="x-picture__image" :src="whiteBackgroundImageUrl" :alt="coverImageMessage" />
      </picture>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-picture-show-case">
      <h2 class="x-title2">Colored</h2>
      <picture class="x-picture x-picture--colored">
        <img class="x-picture__image" :src="whiteBackgroundImageUrl" :alt="coloredImageMessage" />
      </picture>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-picture-show-case">
      <h2 class="x-title2">Fixed Ratio</h2>
      <picture class="x-picture x-picture--fixed-ratio">
        <img
          class="x-picture__image"
          :src="whiteBackgroundImageUrl"
          :alt="fixedRatioImageMessage"
        />
      </picture>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-picture-show-case">
      <h2 class="x-title2">Fallback</h2>
      <picture class="x-picture">
        <BaseResultFallbackImage />
      </picture>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-picture-show-case">
      <h2 class="x-title2">Placeholder</h2>
      <picture class="x-picture">
        <BaseResultPlaceholderImage />
      </picture>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseResultFallbackImage from '../../components/result/base-result-fallback-image.vue';
  // eslint-disable-next-line max-len
  import BaseResultPlaceholderImage from '../../components/result/base-result-placeholder-image.vue';

  @Component({
    components: { BaseResultFallbackImage, BaseResultPlaceholderImage }
  })
  export default class DesignSystemPicture extends Vue {
    protected whiteBackgroundImageUrl =
      /* eslint-disable max-len */
      'https://images.unsplash.com/photo-1583345784606-9f59c99488de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=clamp&w=200&q=80';
    protected standardImageUrl =
      'https://images.unsplash.com/photo-1605494708535-d7a7b2d2740e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200q=80';
    /* eslint-enable max-len */

    protected defaultImageMessage = 'Default image';
    protected cardImageMessage = 'Card image';
    protected coverImageMessage = 'Cover image';
    protected coloredImageMessage = 'Colored image';
    protected fixedRatioImageMessage = 'Fixed ratio image';
  }
</script>

<style lang="scss" scoped>
  .x-picture-show-case {
    width: 100px;
  }
</style>
