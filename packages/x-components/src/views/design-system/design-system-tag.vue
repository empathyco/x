<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Tags</h1>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>
      <div class="x-tag">
        <PlusIcon />
        <span>text tag</span>
      </div>
      <div class="x-tag">
        <PlusIcon />
        <span>text tag extra large name</span>
      </div>
      <div class="x-tag">
        <span>text tag</span>
      </div>
      <div class="x-tag">
        <span>text tag extra large name</span>
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default Selected</h2>
      <div class="x-tag x-tag--is-selected">
        <PlusIcon />
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--is-selected">
        <PlusIcon />
        <span>text tag extra large name</span>
      </div>
      <div class="x-tag x-tag--is-selected">
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--is-selected">
        <span>text tag extra large name</span>
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Card</h2>
      <div class="x-tag x-tag--card">
        <PlusIcon />
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--card">
        <PlusIcon />
        <span>text tag extra large name</span>
      </div>
      <div class="x-tag x-tag--card">
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--card">
        <span>text tag extra large name</span>
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Card Selected</h2>
      <div class="x-tag x-tag--card x-tag--is-selected">
        <PlusIcon />
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--card x-tag--is-selected">
        <PlusIcon />
        <span>text tag extra large name</span>
      </div>
      <div class="x-tag x-tag--card x-tag--is-selected">
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--card x-tag--is-selected">
        <span>text tag extra large name</span>
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Pill</h2>
      <div class="x-tag x-tag--pill">
        <PlusIcon />
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--pill">
        <PlusIcon />
        <span>text tag extra large name</span>
      </div>
      <div class="x-tag x-tag--pill">
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--pill">
        <span>text tag extra large name</span>
      </div>
      <div class="x-tag x-tag--pill">
        <span>1</span>
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Pill Selected</h2>
      <div class="x-tag x-tag--pill x-tag--is-selected">
        <PlusIcon />
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--pill x-tag--is-selected">
        <PlusIcon />
        <span>text tag extra large name</span>
      </div>
      <div class="x-tag x-tag--pill x-tag--is-selected">
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--pill x-tag--is-selected">
        <span>text tag extra large name</span>
      </div>
      <div class="x-tag x-tag--pill x-tag--is-selected">
        <span>1</span>
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Ghost</h2>
      <div class="x-tag x-tag--ghost">
        <PlusIcon />
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--ghost">
        <PlusIcon />
        <span>text tag extra large name</span>
      </div>
      <div class="x-tag x-tag--ghost">
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--ghost">
        <span>text tag extra large name</span>
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Ghost Selected</h2>
      <div class="x-tag x-tag--ghost x-tag--is-selected">
        <PlusIcon />
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--ghost x-tag--is-selected">
        <PlusIcon />
        <span>text tag extra large name</span>
      </div>
      <div class="x-tag x-tag--ghost x-tag--is-selected">
        <span>text tag</span>
      </div>
      <div class="x-tag x-tag--ghost x-tag--is-selected">
        <span>text tag extra large name</span>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import PlusIcon from '../../components/icons/plus.vue';

  @Component({ components: { PlusIcon } })
  export default class DesignSystemTag extends Vue {}
</script>

<style lang="scss" scoped>
  .x-tag {
    max-width: 220px;
  }
</style>
