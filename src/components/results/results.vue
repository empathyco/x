<template>
  <ResultsList :animation="staggeredFadeAndSlide">
    <template #layout="{ results, animation }">
      <Grid :items="results" :animation="animation">
        <template #Result="{ item }">
          <Result :result="item" />
        </template>
        <template #Banner="{ item }">
          <span>{{ item.title }}</span>
        </template>
        <template #Promoted="{ item }">
          <span>{{ item.title }}</span>
        </template>
      </Grid>
    </template>
  </ResultsList>
</template>

<script lang="ts">
  import { BaseVariableColumnGrid, StaggeredFadeAndSlide } from '@empathy/x-components';
  import { ResultsList } from '@empathy/x-components/search';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import ResultComponent from './result.vue';

  @Component({
    components: {
      Grid: BaseVariableColumnGrid,
      Result: ResultComponent,
      ResultsList
    }
  })
  export default class Results extends Vue {
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;
  }
</script>
