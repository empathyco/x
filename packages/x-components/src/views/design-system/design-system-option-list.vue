<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Option List</h1>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Divider</h2>
      <div>
        <span class="x-text">Sort by</span>
        <ul class="x-option-list">
          <li class="x-option-list__item">
            <button class="x-button">Option 1</button>
          </li>
          <li class="x-option-list__item x-option-list__item--is-selected">
            <button class="x-button">Option 2</button>
          </li>
          <li class="x-option-list__item">
            <button class="x-button">Option 3</button>
          </li>
        </ul>
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Bottom</h2>
      <div>
        <span class="x-text">Sort by</span>
        <ul class="x-option-list x-option-list--bottom">
          <li class="x-option-list__item">
            <button class="x-button">Option 1</button>
          </li>
          <li class="x-option-list__item x-option-list__item--is-selected">
            <button class="x-button">Option 2</button>
          </li>
          <li class="x-option-list__item">
            <button class="x-button">Option 3</button>
          </li>
        </ul>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class DesignSystemOptionList extends Vue {}
</script>

<style lang="scss"></style>
