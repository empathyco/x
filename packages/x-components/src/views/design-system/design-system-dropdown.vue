<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Dropdown</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-dropdown-show-case">
      <h2 class="x-title2">Default</h2>

      <div class="x-dropdown">
        <button class="x-dropdown__toggle">
          <span>Sort by</span>
          <span class="x-dropdown__toggle-selected-value">Relevance</span>
          <ChevronDownIcon />
        </button>
      </div>
      <div class="x-dropdown x-dropdown--is-open">
        <button class="x-dropdown__toggle">
          <span>Sort by</span>
          <span class="x-dropdown__toggle-selected-value">Relevance</span>
          <ChevronDownIcon />
        </button>
        <div class="x-dropdown__items-list">
          <button class="x-dropdown__item x-dropdown__item--is-selected">
            <span>Relevance</span>
            <CheckIcon />
          </button>
          <button class="x-dropdown__item">Alphabetical</button>
          <button class="x-dropdown__item">Price</button>
        </div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-dropdown-show-case">
      <h2 class="x-title2">Card</h2>

      <div class="x-dropdown x-dropdown--card">
        <button class="x-dropdown__toggle">
          <span>Sort by</span>
          <span class="x-dropdown__toggle-selected-value">Relevance</span>
          <ChevronDownIcon />
        </button>
      </div>
      <div class="x-dropdown x-dropdown--is-open x-dropdown--card">
        <button class="x-dropdown__toggle">
          <span>Sort by</span>
          <span class="x-dropdown__toggle-selected-value">Relevance</span>
          <ChevronDownIcon />
        </button>
        <div class="x-dropdown__items-list">
          <button class="x-dropdown__item x-dropdown__item--is-selected">
            <span>Relevance</span>
            <CheckIcon />
          </button>
          <button class="x-dropdown__item">Alphabetical</button>
          <button class="x-dropdown__item">Price</button>
        </div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-dropdown-show-case">
      <h2 class="x-title2">Pill</h2>

      <div class="x-dropdown x-dropdown--pill">
        <button class="x-dropdown__toggle">
          <span>Sort by</span>
          <span class="x-dropdown__toggle-selected-value">Relevance</span>
          <ChevronDownIcon />
        </button>
      </div>
      <div class="x-dropdown x-dropdown--is-open x-dropdown--pill">
        <button class="x-dropdown__toggle">
          <span>Sort by</span>
          <span class="x-dropdown__toggle-selected-value">Relevance</span>
          <ChevronDownIcon />
        </button>
        <div class="x-dropdown__items-list">
          <button class="x-dropdown__item x-dropdown__item--is-selected">
            <span>Relevance</span>
            <CheckIcon />
          </button>
          <button class="x-dropdown__item">Alphabetical</button>
          <button class="x-dropdown__item">Price</button>
        </div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-dropdown-show-case">
      <h2 class="x-title2">Line</h2>

      <div class="x-dropdown x-dropdown--line">
        <button class="x-dropdown__toggle">
          <span>Sort by</span>
          <span class="x-dropdown__toggle-selected-value">Relevance</span>
          <ChevronDownIcon />
        </button>
      </div>
      <div class="x-dropdown x-dropdown--is-open x-dropdown--line">
        <button class="x-dropdown__toggle">
          <span>Sort by</span>
          <span class="x-dropdown__toggle-selected-value">Relevance</span>
          <ChevronDownIcon />
        </button>
        <div class="x-dropdown__items-list">
          <button class="x-dropdown__item x-dropdown__item--is-selected">
            <span>Relevance</span>
            <CheckIcon />
          </button>
          <button class="x-dropdown__item">Alphabetical</button>
          <button class="x-dropdown__item">Price</button>
        </div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-list x-list--gap-06">
      <h2 class="x-title2">Size variants</h2>
      <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-dropdown-show-case">
        <h3 class="x-title3">Default</h3>
        <div class="x-dropdown">
          <button class="x-dropdown__toggle">
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <ChevronDownIcon />
          </button>
          <div class="x-dropdown__items-list">
            <button class="x-dropdown__item x-dropdown__item--is-selected">
              <span>Relevance</span>
              <CheckIcon />
            </button>
            <button class="x-dropdown__item">Alphabetical</button>
            <button class="x-dropdown__item">Price</button>
          </div>
        </div>
      </article>
      <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-dropdown-show-case">
        <h3 class="x-title3">Small</h3>
        <div class="x-dropdown x-dropdown--s x-dropdown--is-open">
          <button class="x-dropdown__toggle">
            <Grid2ColIcon />
            <ChevronDownIcon />
          </button>
          <div class="x-dropdown__items-list">
            <button class="x-dropdown__item">
              <Grid1ColIcon />
            </button>
            <button class="x-dropdown__item x-dropdown__item--is-selected">
              <Grid2ColIcon />
              <CheckIcon />
            </button>
          </div>
        </div>
      </article>
      <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-dropdown-show-case">
        <h3 class="x-title3">Medium</h3>
        <div class="x-dropdown x-dropdown--m x-dropdown--is-open">
          <button class="x-dropdown__toggle">
            <span>Sort by</span>
            <ChevronDownIcon />
          </button>
          <div class="x-dropdown__items-list">
            <button class="x-dropdown__item x-dropdown__item--is-selected">
              <span>Relevance</span>
              <CheckIcon />
            </button>
            <button class="x-dropdown__item">Alphabetical</button>
            <button class="x-dropdown__item">Price</button>
          </div>
        </div>
      </article>
      <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-dropdown-show-case">
        <h3 class="x-title3">Large</h3>
        <div class="x-dropdown x-dropdown--l x-dropdown--is-open">
          <button class="x-dropdown__toggle">
            <span>Sort by</span>
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <ChevronDownIcon />
          </button>
          <div class="x-dropdown__items-list">
            <button class="x-dropdown__item x-dropdown__item--is-selected">
              <span>Relevance</span>
              <CheckIcon />
            </button>
            <button class="x-dropdown__item">Alphabetical</button>
            <button class="x-dropdown__item">Price</button>
          </div>
        </div>
      </article>
      <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-dropdown-show-case">
        <h3 class="x-title3">Extra large</h3>
        <div class="x-dropdown x-dropdown--xl x-dropdown--is-open">
          <button class="x-dropdown__toggle">
            <span>Sort by</span>
            <span class="x-dropdown__toggle-selected-value">Relevance</span>
            <ChevronDownIcon />
          </button>
          <div class="x-dropdown__items-list">
            <button class="x-dropdown__item x-dropdown__item--is-selected">
              <span>Relevance</span>
              <CheckIcon />
            </button>
            <button class="x-dropdown__item">Alphabetical</button>
            <button class="x-dropdown__item">Price</button>
          </div>
        </div>
      </article>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import ChevronDownIcon from '../../components/icons/chevron-down.vue';
  import Grid2ColIcon from '../../components/icons/grid-2-col.vue';
  import Grid1ColIcon from '../../components/icons/grid-1-col.vue';
  import CheckIcon from '../../components/icons/check.vue';

  @Component({
    components: { ChevronDownIcon, Grid1ColIcon, Grid2ColIcon, CheckIcon }
  })
  export default class DesignSystemDropdown extends Vue {}
</script>

<style lang="scss" scoped>
  .x-dropdown-show-case {
    padding-bottom: 8em;
  }
</style>
