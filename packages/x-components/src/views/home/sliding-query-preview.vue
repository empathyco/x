<template>
  <QueryPreview :query="query" #default="{ results, totalResults, query }">
    <div class="x-list x-list--gap-03 x-margin--bottom-05">
      <h1 class="x-title2 x-text--bold">{{ query }} ({{ totalResults }})</h1>
      <SlidingPanel :resetOnContentChange="false">
        <div class="x-list x-list--gap-03">
          <Result
            v-for="result in results"
            :key="result.id"
            :result="result"
            style="max-width: 180px"
          />
        </div>
      </SlidingPanel>
    </div>
  </QueryPreview>
</template>

<script lang="ts">
  import { Component, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import QueryPreview from '../../x-modules/queries-preview/components/query-preview.vue';
  import SlidingPanel from '../../components/sliding-panel.vue';
  import Result from './result.vue';

  @Component({
    components: {
      QueryPreview,
      Result,
      SlidingPanel
    }
  })
  export default class SlidingQueryPreview extends Vue {
    @Prop({
      required: true
    })
    public query!: string;
  }
</script>
