<template>
  <div>
    <h1>Infinite Scroll</h1>
    <header class="header">
      <SearchInput />
    </header>
    <BaseScroll id="test1" class="main-scroll">
      <ResultsList v-infinite-scroll:test1 />
    </BaseScroll>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseScroll from '../components/scroll/base-scroll.vue';
  import { infiniteScroll } from '../directives/infinite-scroll/infinite-scroll';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import ResultsList from '../x-modules/search/components/results-list.vue';

  @Component({
    components: {
      BaseScroll,
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
  .main-scroll {
    margin: 20px 0;
    height: 400px;
    overflow-y: auto;
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
