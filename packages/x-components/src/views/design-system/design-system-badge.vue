<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Badge</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <div class="x-button x-badge-container">
        More filters
        <span class="x-badge">2</span>
      </div>

      <div class="x-button x-badge-container">
        More filters
        <span class="x-badge">+1234</span>
      </div>

      <div class="x-button x-button--round x-badge-container">
        <FiltersIcon />
        <span class="x-badge">40</span>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import FiltersIcon from '../../components/icons/filters.vue';

  @Component({ components: { FiltersIcon } })
  export default class DesignSystemBadge extends Vue {}
</script>

<style lang="scss"></style>
