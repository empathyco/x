<template>
  <div>
    <WindowScroll scrollableElement="body" />
    <UrlHandler />
    <h1>Infinite Scroll Body</h1>
    <header class="header">
      <SearchInput />
    </header>
    <MainScroll use-window>
      <ResultsList #result="{ item }" v-infinite-scroll:body>
        <MainScrollItem :item="item">
          <img :src="item.images[0]" :alt="item.name" />
        </MainScrollItem>
      </ResultsList>
    </MainScroll>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { infiniteScroll } from '../directives/infinite-scroll/infinite-scroll';
  import MainScrollItem from '../x-modules/scroll/components/main-scroll-item.vue';
  import MainScroll from '../x-modules/scroll/components/main-scroll.vue';
  import WindowScroll from '../x-modules/scroll/components/window-scroll.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import ResultsList from '../x-modules/search/components/results-list.vue';
  import UrlHandler from '../x-modules/url/components/url-handler.vue';

  @Component({
    components: {
      MainScroll,
      WindowScroll,
      UrlHandler,
      MainScrollItem,
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
    box-sizing: border-box;
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
