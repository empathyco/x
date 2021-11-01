<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Row Item</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>
      <ul class="x-row">
        <li class="x-row__item">0</li>
      </ul>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Span</h2>

      <ul v-for="span in 12" :key="span" class="x-row">
        <li class="x-row__item" :class="`x-row__item--span-${span}`">{{ span }}</li>
      </ul>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Start</h2>

      <ul v-for="start in 12" :key="start" class="x-row">
        <li class="x-row__item" :class="`x-row__item--start-${start}`">{{ start }}</li>
      </ul>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class DesignSystemRowItem extends Vue {}
</script>

<style lang="scss" scoped>
  .x-row {
    background: var(--x-color-base-neutral-95);
    width: 500px;
    height: var(--x-size-base-08);

    &__item {
      padding: var(--x-size-base-02);
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--x-color-base-auxiliary);
      border: solid 1px var(--x-color-base-neutral-95);
      color: var(--x-color-base-neutral-95);
    }
  }
</style>
