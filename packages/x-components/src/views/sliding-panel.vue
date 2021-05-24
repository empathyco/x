<template>
  <main>
    <SlidingPanel>
      <ul class="items" data-test="items">
        <li v-for="item in items" :key="item" class="item x-tag" data-test="item">
          {{ item }}
        </li>
      </ul>
    </SlidingPanel>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { SlidingPanel } from '../components';
  @Component({
    components: {
      SlidingPanel
    }
  })
  export default class App extends Vue {
    protected items = ['Item One', 'Item Two', 'Item Three', 'Item Four', 'Item Five'];
  }
</script>

<style lang="scss">
  .x-sliding-panel {
    max-width: 300px;

    &__scroll {
      white-space: nowrap;

      > ul {
        display: flex;
        padding: 0;

        & > li {
          text-decoration: none;
        }
      }
    }
  }
</style>
