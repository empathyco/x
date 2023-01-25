<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Typography</h1>

    <h1 class="x-text">Text</h1>
    <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
      <span class="x-text">text typography</span>
      <span class="x-text x-text--accent">text typography accent</span>
      <span class="x-text x-text--bold">text typography bold</span>
      <span class="x-text x-text--light">text typography light</span>
      <span class="x-text x-text--secondary">text typography secondary</span>
      <span class="x-text x-text--stroke">text typography stroke</span>
    </section>

    <h1 class="x-title1">Title 1</h1>
    <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
      <span class="x-title1">Title1 Typography</span>
      <span class="x-text--accent x-title1">Title1 Typography Accent</span>
      <span class="x-text--bold x-title1">Title1 Typography Bold</span>
      <span class="x-text--light x-title1">Title1 Typography Light</span>
      <span class="x-text--secondary x-title1">Title1 Typography Secondary</span>
      <span class="x-text--stroke x-title1">Title1 Typography Stroke</span>
    </section>

    <h1 class="x-title2">Title 2</h1>
    <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
      <span class="x-title2">Title2 Typography</span>
      <span class="x-text--accent x-title2">Title2 Typography Accent</span>
      <span class="x-text--bold x-title2">Title2 Typography Bold</span>
      <span class="x-text--light x-title2">Title2 Typography Light</span>
      <span class="x-text--secondary x-title2">Title2 Typography Secondary</span>
      <span class="x-text--stroke x-title2">Title2 Typography Stroke</span>
    </section>

    <h1 class="x-title3">Title 3</h1>
    <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
      <span class="x-title3">Title3 Typography</span>
      <span class="x-text--accent x-title3">Title3 Typography Accent</span>
      <span class="x-text--bold x-title3">Title3 Typography Bold</span>
      <span class="x-text--light x-title3">Title3 Typography Light</span>
      <span class="x-text--secondary x-title3">Title3 Typography Secondary</span>
      <span class="x-text--stroke x-title3">Title3 Typography Stroke</span>
    </section>

    <h1 class="x-small">Small</h1>
    <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
      <span class="x-small">small typography</span>
      <span class="x-small x-text--accent">small typography accent</span>
      <span class="x-small x-text--bold">small typography bold</span>
      <span class="x-small x-text--light">small typography light</span>
      <span class="x-small x-text--secondary">small typography secondary</span>
      <span class="x-small x-text--stroke">small typography stroke</span>
    </section>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class DesignSystemTypography extends Vue {}
</script>

<style lang="scss"></style>
