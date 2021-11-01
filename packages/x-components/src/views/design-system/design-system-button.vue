<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Button</h1>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>
      <button class="x-button">Default</button>
      <button class="x-button">
        <SearchIcon />
        <span>Default</span>
      </button>
      <button class="x-button x-button--card">
        <SearchIcon />
        <span>Default Card</span>
      </button>
      <button class="x-button x-button--pill">
        <SearchIcon />
        <span>Default Pill</span>
      </button>
      <button class="x-button x-button--round">
        <SearchIcon />
      </button>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-button--primary">
      <h2 class="x-title2">Primary</h2>
      <button class="x-button">Primary</button>
      <button class="x-button">
        <SearchIcon />
        <span>Primary</span>
      </button>
      <button class="x-button x-button--card">
        <SearchIcon />
        <span>Primary Card</span>
      </button>
      <button class="x-button x-button--pill">
        <SearchIcon />
        <span>Primary Pill</span>
      </button>
      <button class="x-button x-button--round">
        <SearchIcon />
      </button>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-button--secondary">
      <h2 class="x-title2">Secondary</h2>
      <button class="x-button">Secondary</button>
      <button class="x-button">
        <SearchIcon />
        <span>Secondary</span>
      </button>
      <button class="x-button x-button--card">
        <SearchIcon />
        <span>Secondary Card</span>
      </button>
      <button class="x-button x-button--pill">
        <SearchIcon />
        <span>Secondary Pill</span>
      </button>
      <button class="x-button x-button--round">
        <SearchIcon />
      </button>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-button--tertiary">
      <h2 class="x-title2">Tertiary</h2>
      <button class="x-button">Tertiary</button>
      <button class="x-button">
        <SearchIcon />
        <span>Tertiary</span>
      </button>
      <button class="x-button x-button--card">
        <SearchIcon />
        <span>Tertiary Card</span>
      </button>
      <button class="x-button x-button--pill">
        <SearchIcon />
        <span>Tertiary Pill</span>
      </button>
      <button class="x-button x-button--round">
        <SearchIcon />
      </button>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start x-button--ghost">
      <h2 class="x-title2">Ghost</h2>
      <button class="x-button">Ghost</button>
      <button class="x-button">
        <SearchIcon />
        <span>Ghost</span>
      </button>
      <button class="x-button x-button--card">
        <SearchIcon />
        <span>Ghost Card</span>
      </button>
      <button class="x-button x-button--pill">
        <SearchIcon />
        <span>Ghost Pill</span>
      </button>
      <button class="x-button x-button--round">
        <SearchIcon />
      </button>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import SearchIcon from '../../components/icons/search.vue';

  @Component({
    components: { SearchIcon }
  })
  export default class DesignSystemButton extends Vue {}
</script>

<style lang="scss"></style>
