<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Progress Bar</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>

      <div class="x-progress-bar">
        <div class="x-progress-bar__line"></div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Playing with tokens</h2>

      <div
        class="x-progress-bar"
        style="
          --x-color-background-progress-bar-default: var(--x-color-base-auxiliary);
          --x-color-background-progress-bar-line-default: var(--x-color-base-lead);
          --x-color-border-progress-bar-default: var(--x-color-base-neutral-70);
          --x-size-border-width-progress-bar-default: var(--x-size-base-02);
          --x-size-height-progress-bar-line-default: var(--x-size-base-05);
          --x-size-border-radius-progress-bar-default: var(--x-size-border-radius-base-s);
        "
      >
        <div class="x-progress-bar__line"></div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class DesignSystemProgressBar extends Vue {}
</script>

<style lang="scss" scoped>
  .x-progress-bar__line {
    transform: translateX(-30%);
  }
</style>
