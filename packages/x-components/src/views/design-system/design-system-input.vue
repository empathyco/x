<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Input</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>
      <input type="text" class="x-input" placeholder="type here" :aria-label="inputTextMessage" />
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-input--card">
      <h2 class="x-title2">Card</h2>
      <input type="text" class="x-input" placeholder="type here" :aria-label="inputTextMessage" />
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-input--line">
      <h2 class="x-title2">Line</h2>
      <input type="text" class="x-input" placeholder="type here" :aria-label="inputTextMessage" />
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-input--pill">
      <h2 class="x-title2">Pill</h2>
      <input type="text" class="x-input" placeholder="type here" :aria-label="inputTextMessage" />
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class DesignSystemInput extends Vue {
    protected inputTextMessage = 'type here';
  }
</script>

<style lang="scss"></style>
