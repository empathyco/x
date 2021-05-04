<template>
  <PartialResultsList>
    <template #default="{ partialResult }">
      <span>{{ partialResult.query }}</span>
      <BaseGrid :columns="4" :items="partialResult.results">
        <template #Result="{ item }">
          <Result :result="item" />
        </template>
      </BaseGrid>
      <PartialQueryButton :query="partialResult.query">
        <template #default="{ query }">Ver todos {{ query }}</template>
      </PartialQueryButton>
    </template>
  </PartialResultsList>
</template>

<script lang="ts">
  import { PartialResultsList, PartialQueryButton } from '@empathy/x-components/search';
  import { BaseGrid } from '@empathy/x-components';
  import { Component, Vue } from 'vue-property-decorator';
  import ResultComponent from './result.vue';

  @Component({
    components: {
      BaseGrid,
      PartialResultsList,
      PartialQueryButton,
      Result: ResultComponent
    }
  })
  export default class PartialResults extends Vue {}
</script>
