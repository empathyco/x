<template>
  <main>
    <BaseColumnPickerList #default="{ column }" :columns="[2, 4, 6]">
      <span>{{ column }}⇋</span>
    </BaseColumnPickerList>
    <BaseVariableColumnGrid :items="searchResponseStub">
      <template #banner="{ item }">
        <span :class="`x-banner__${item.id}`">Banner: {{ item.modelName }}</span>
      </template>
      <template #promoted="{ item }">
        <span>Promoted: {{ item.modelName }}</span>
      </template>
      <template #result="{ item }">
        <span>Result: {{ item.modelName }}</span>
      </template>
      <template #next-queries="{ item }">
        <span>Nextqueries: {{ item.modelName }}</span>
      </template>
      <template #default="{ item }">
        <span>Default: {{ item }}</span>
      </template>
    </BaseVariableColumnGrid>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { getSearchResponseStub } from '../../__stubs__/search-response-stubs.factory';
  import BaseVariableColumnGrid from '../../components/base-variable-column-grid.vue';
  import BaseColumnPickerList from '../../components/column-picker/base-column-picker-list.vue';

  @Component({
    components: {
      BaseColumnPickerList,
      BaseVariableColumnGrid
    }
  })
  export default class App extends Vue {
    private searchResponse = getSearchResponseStub();
    protected searchResponseStub = [
      ...this.searchResponse.banners!,
      ...this.searchResponse.promoteds!,
      ...this.searchResponse.results
    ];
  }
</script>

<style lang="scss">
  .x-components-images {
    position: absolute;
    top: 1500px;
    display: flex;
    flex-direction: column;
  }

  .x-base-grid {
    column-gap: 10px;
    row-gap: 10px;

    &__item {
      border: 1px solid black;
      padding: 20px;
      text-align: center;
    }

    &__next-queries {
      border-color: red;
      border-radius: 50px;
    }

    &__x-result {
      border-color: deepskyblue;
    }

    &__banner {
      border-color: blueviolet;
      grid-column: -1/1;
    }

    &__promoted {
      border-color: orange;
    }
  }
</style>
