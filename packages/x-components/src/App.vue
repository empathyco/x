<template>
  <main>
    <SearchBox />
    <TermSuggestions />
  </main>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import SearchBox from './x-modules/search-box/search-box.vue';
  import TermSuggestions from './x-modules/term-suggestions/term-suggestions.vue';

  @Component({
    components: {
      SearchBox,
      TermSuggestions
    }
  })
  export default class App extends Vue {}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    margin-top: 60px;
    text-align: center;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
