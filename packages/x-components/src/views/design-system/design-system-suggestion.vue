<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Suggestion</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>

      <div class="x-suggestion">
        <span class="x-suggestion__query">Suggestion</span>
      </div>

      <div class="x-suggestion x-suggestion--matching">
        <span class="x-suggestion__query">
          Suggestion
          <span class="x-suggestion__matching-part">Query</span>
        </span>
      </div>

      <div class="x-suggestion x-suggestion--matching">
        <SearchIcon />
        <span class="x-suggestion__query">
          Suggestion
          <span class="x-suggestion__matching-part">Query</span>
        </span>
      </div>

      <div class="x-suggestion x-suggestion--matching">
        <span class="x-suggestion__query">
          Suggestion
          <span class="x-suggestion__matching-part">Query</span>
        </span>
        <SearchIcon />
      </div>

      <div class="x-suggestion x-suggestion--matching">
        <SearchIcon />
        <span class="x-suggestion__query">
          Suggestion extra large name
          <span class="x-suggestion__matching-part">Query</span>
        </span>
      </div>

      <div class="x-suggestion x-suggestion--matching">
        <span class="x-suggestion__query">
          Suggestion extra large name
          <span class="x-suggestion__matching-part">Query</span>
        </span>
        <SearchIcon />
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default + Tag</h2>

      <div class="x-suggestion x-tag">
        <span class="x-suggestion__query">Suggestion</span>
      </div>

      <div class="x-suggestion x-suggestion--matching x-tag">
        <span class="x-suggestion__query">
          Suggestion
          <span class="x-suggestion__matching-part">Query</span>
        </span>
      </div>

      <div class="x-suggestion x-suggestion--matching x-tag">
        <SearchIcon />
        <span class="x-suggestion__query">
          Suggestion
          <span class="x-suggestion__matching-part">Query</span>
        </span>
      </div>

      <div class="x-suggestion x-suggestion--matching x-tag">
        <span class="x-suggestion__query">
          Suggestion
          <span class="x-suggestion__matching-part">Query</span>
        </span>
        <SearchIcon />
      </div>

      <div class="x-suggestion x-suggestion--matching x-tag">
        <SearchIcon />
        <span class="x-suggestion__query">
          Suggestion extra large name
          <span class="x-suggestion__matching-part">Query</span>
        </span>
      </div>

      <div class="x-tag x-suggestion x-suggestion--matching x-tag">
        <span class="x-suggestion__query">
          Suggestion extra large name
          <span class="x-suggestion__matching-part">Query</span>
        </span>
        <SearchIcon />
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Curated</h2>

      <div class="x-suggestion x-suggestion--is-curated">
        <CuratedCheck />
        <span class="x-suggestion__query">Suggestion</span>
      </div>

      <div class="x-suggestion x-suggestion--is-curated x-suggestion--matching">
        <CuratedCheck />
        <span class="x-suggestion__query">
          Suggestion
          <span class="x-suggestion__matching-part">Query</span>
        </span>
      </div>

      <div class="x-suggestion x-suggestion--is-curated x-suggestion--matching">
        <CuratedCheck />
        <span class="x-suggestion__query">
          Suggestion extra large name
          <span class="x-suggestion__matching-part">Query</span>
        </span>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import CuratedCheck from '../../components/icons/curated-check.vue';
  import SearchIcon from '../../components/icons/search.vue';

  @Component({ components: { CuratedCheck, SearchIcon } })
  export default class DesignSystemSuggestion extends Vue {}
</script>

<style lang="scss">
  .x-suggestion {
    max-width: 220px;
  }
</style>
