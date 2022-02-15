<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Suggestion Group</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>

      <div class="x-suggestion-group">
        <div class="x-suggestion">
          <span class="x-suggestion__query">Suggestion</span>
        </div>
        <button class="x-button">
          <CrossIcon />
        </button>
      </div>

      <div class="x-suggestion-group">
        <div class="x-suggestion x-suggestion--matching">
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
        </div>
        <button class="x-button">
          <CrossIcon />
        </button>
      </div>

      <div class="x-suggestion-group">
        <button class="x-button">
          <CrossIcon />
        </button>
        <div class="x-suggestion x-suggestion--matching">
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
        </div>
      </div>

      <div class="x-suggestion-group">
        <div class="x-suggestion x-suggestion--matching">
          <SearchIcon />
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
        </div>
        <button class="x-button">
          <CrossIcon />
        </button>
      </div>

      <div class="x-suggestion-group">
        <button class="x-button">
          <CrossIcon />
        </button>
        <div class="x-suggestion x-suggestion--matching">
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
          <SearchIcon />
        </div>
      </div>

      <div class="x-suggestion-group">
        <button class="x-button">
          <CrossIcon />
        </button>
        <div class="x-suggestion x-suggestion--matching">
          <span class="x-suggestion__query">
            Suggestion extra large name
            <span class="x-suggestion__matching-part">Query</span>
          </span>
          <SearchIcon />
        </div>
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default + Tag</h2>

      <div class="x-suggestion-group x-tag">
        <div class="x-suggestion">
          <span class="x-suggestion__query">Suggestion</span>
        </div>
        <button class="x-button">
          <CrossIcon />
        </button>
      </div>

      <div class="x-suggestion-group x-tag">
        <div class="x-suggestion x-suggestion--matching">
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
        </div>
        <button class="x-button">
          <CrossIcon />
        </button>
      </div>

      <div class="x-suggestion-group x-tag">
        <button class="x-button">
          <CrossIcon />
        </button>
        <div class="x-suggestion x-suggestion--matching">
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
        </div>
      </div>

      <div class="x-suggestion-group x-tag">
        <div class="x-suggestion x-suggestion--matching">
          <SearchIcon />
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
        </div>
        <button class="x-button">
          <CrossIcon />
        </button>
      </div>

      <div class="x-suggestion-group x-tag">
        <button class="x-button">
          <CrossIcon />
        </button>
        <div class="x-suggestion x-suggestion--matching">
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
          <SearchIcon />
        </div>
      </div>

      <div class="x-suggestion-group x-tag">
        <button class="x-button">
          <CrossIcon />
        </button>
        <div class="x-suggestion x-suggestion--matching">
          <span class="x-suggestion__query">
            Suggestion extra large name
            <span class="x-suggestion__matching-part">Query</span>
          </span>
          <SearchIcon />
        </div>
      </div>
    </article>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Curated</h2>

      <div class="x-suggestion-group">
        <div class="x-suggestion x-suggestion--is-curated">
          <CuratedCheck />
          <span class="x-suggestion__query">Suggestion</span>
        </div>
        <button class="x-button">
          <CrossIcon />
        </button>
      </div>

      <div class="x-suggestion-group">
        <div class="x-suggestion x-suggestion--is-curated x-suggestion--matching">
          <CuratedCheck />
          <span class="x-suggestion__query">
            Suggestion
            <span class="x-suggestion__matching-part">Query</span>
          </span>
        </div>
        <button class="x-button">
          <CrossIcon />
        </button>
      </div>

      <div class="x-suggestion-group">
        <button class="x-button">
          <CrossIcon />
        </button>
        <div class="x-suggestion x-suggestion--is-curated x-suggestion--matching">
          <span class="x-suggestion__query">
            Suggestion extra large name
            <span class="x-suggestion__matching-part">Query</span>
          </span>
          <CuratedCheck />
        </div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import CuratedCheck from '../../components/icons/curated-check.vue';
  import CrossIcon from '../../components/icons/cross.vue';
  import SearchIcon from '../../components/icons/search.vue';

  @Component({
    components: {
      CuratedCheck,
      CrossIcon,
      SearchIcon
    }
  })
  export default class DesignSystemSuggestionGroup extends Vue {}
</script>

<style lang="scss"></style>
