<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Result</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>
      <div class="x-result">
        <div class="x-result__picture">
          <div class="x-result__picture-placeholder"></div>
        </div>
        <div class="x-result__overlay">
          <div class="x-result__overlay-placeholder"></div>
        </div>
        <div class="x-result__description">
          <div class="x-result__description-placeholder"></div>
        </div>
      </div>

      <div class="x-result">
        <div class="x-result__picture">
          <picture class="x-picture x-picture--cover x-picture--colored">
            <img
              class="x-picture__image"
              :src="whiteBackgroundImageUrl"
              :alt="whiteBackgroundImageMessage"
            />
          </picture>
        </div>
        <div class="x-result__overlay x-list x-list--horizontal x-padding--02">
          <button class="x-button primary x-list__item--expand">Add to Cart</button>
        </div>
        <div class="x-result__description x-list x-list--align-center">
          <h1 class="x-title2">Empathy Dress</h1>
          <span class="x-text">For special moments</span>
          <span class="x-title1">120 €</span>
        </div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Card</h2>
      <div class="x-result x-result--card">
        <div class="x-result__picture">
          <div class="x-result__picture-placeholder"></div>
        </div>
        <div class="x-result__overlay">
          <div class="x-result__overlay-placeholder"></div>
        </div>
        <div class="x-result__description">
          <div class="x-result__description-placeholder"></div>
        </div>
      </div>

      <div class="x-result x-result--card">
        <div class="x-result__picture">
          <picture class="x-picture x-picture--cover x-picture--colored">
            <img
              class="x-picture__image"
              :src="whiteBackgroundImageUrl"
              :alt="whiteBackgroundImageMessage"
            />
          </picture>
        </div>
        <div class="x-result__overlay x-list x-list--horizontal x-padding--02">
          <button class="x-button primary x-list__item--expand">Add to Cart</button>
        </div>
        <div class="x-result__description x-list x-list--align-center">
          <h1 class="x-title2">Empathy Dress</h1>
          <span class="x-text">For special moments</span>
          <span class="x-title1">120 €</span>
        </div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class DesignSystemResult extends Vue {
    protected whiteBackgroundImageUrl =
      /* eslint-disable max-len */
      'https://images.unsplash.com/photo-1583345784606-9f59c99488de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=clamp&w=200&q=80';

    protected whiteBackgroundImageMessage = 'Woman in blue flower print dress';
  }
</script>

<style lang="scss" scoped>
  .x-result {
    width: 250px;
    background-color: var(--x-color-base-neutral-95);

    &__picture-placeholder {
      height: 300px;
      width: 100%;
      background-color: var(--x-color-base-auxiliary);
    }

    &__overlay-placeholder {
      height: 60px;
      width: 100%;
      background-color: var(--x-color-base-neutral-70);
    }

    &__description-placeholder {
      height: 90px;
      width: 100%;
      background-color: var(--x-color-base-lead);
    }

    .x-title1,
    .x-title2 {
      width: auto;
    }
  }
</style>
