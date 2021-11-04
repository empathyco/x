<template>
  <div>
    <h1>Infinite Scroll</h1>
    <header class="header">
      <SearchInput />
    </header>
    <ResultsList v-infinite-scroll:body />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { infiniteScroll } from '../directives/infinite-scroll/infinite-scroll';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import ResultsList from '../x-modules/search/components/results-list.vue';

  @Component({
    components: {
      ResultsList,
      SearchInput
    },
    directives: {
      'infinite-scroll': infiniteScroll
    }
  })
  export default class Search extends Vue {}
</script>

<style lang="scss">
  html,
  body {
    height: 100%;
    max-height: 100%;
    padding: 0;
    margin: 0;
  }

  html {
    overflow: hidden;
  }

  body {
    overflow: auto;
    border: 2px solid darkorange;
  }

  .x-results-list {
    margin: 10px;
    border: 2px solid darkcyan;

    &__item {
      padding: 10px 0;

      &:nth-child(even) {
        background-color: lightgray;
      }
    }
  }
</style>
