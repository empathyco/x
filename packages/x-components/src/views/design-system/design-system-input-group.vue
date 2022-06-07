<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Input Group</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>

      <div class="x-input-group">
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
        <button class="x-button x-input-group__action">
          <SearchIcon />
        </button>
      </div>

      <div class="x-input-group">
        <span class="x-input-group__action"><SearchIcon /></span>
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
        <button class="x-button x-button--secondary x-input-group__action">Search</button>
      </div>

      <div class="x-input-group">
        <button class="x-button x-button--tertiary x-input-group__action">
          <SearchIcon />
        </button>
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-input-group--pill">
      <h2 class="x-title2">Pill</h2>

      <div class="x-input-group">
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
        <button class="x-button x-input-group__action">
          <SearchIcon />
        </button>
      </div>

      <div class="x-input-group">
        <span class="x-input-group__action"><SearchIcon /></span>
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
        <button class="x-button x-button--secondary x-input-group__action">Search</button>
      </div>

      <div class="x-input-group">
        <button class="x-button x-button--tertiary x-input-group__action">
          <SearchIcon />
        </button>
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-input-group--card">
      <h2 class="x-title2">Card</h2>

      <div class="x-input-group">
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
        <button class="x-button x-input-group__action">
          <SearchIcon />
        </button>
      </div>

      <div class="x-input-group">
        <span class="x-input-group__action"><SearchIcon /></span>
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
        <button class="x-button x-button--secondary x-input-group__action">Search</button>
      </div>

      <div class="x-input-group">
        <button class="x-button x-button--tertiary x-input-group__action">
          <SearchIcon />
        </button>
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-input-group--line">
      <h2 class="x-title2">Line</h2>

      <div class="x-input-group">
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
        <button class="x-button x-input-group__action">
          <SearchIcon />
        </button>
      </div>

      <div class="x-input-group">
        <span class="x-input-group__action"><SearchIcon /></span>
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
        <button class="x-button x-button--secondary x-input-group__action">Search</button>
      </div>

      <div class="x-input-group">
        <button class="x-button x-button--tertiary x-input-group__action">
          <SearchIcon />
        </button>
        <input type="text" class="x-input" placeholder="type here" :aria-label="searchBoxMessage" />
        <button class="x-button">Clear</button>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import SearchIcon from '../../components/icons/search.vue';
  @Component({ components: { SearchIcon } })
  export default class DesignSystemInputGroup extends Vue {
    protected searchBoxMessage = 'Type your query here';
  }
</script>

<style lang="scss" scoped>
  .x-input-group {
    width: 250px;
  }
</style>
