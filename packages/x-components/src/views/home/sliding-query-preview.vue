<template>
  <QueryPreview :debounceTimeMs="250" :query="query" #default="{ results, totalResults, query }">
    <div class="x-list x-list--gap-03 x-mb-16">
      <h1 class="x-title2">{{ query }} ({{ totalResults }})</h1>
      <SlidingPanel :resetOnContentChange="false" scrollContainerClass="x-sliding-panel-fade">
        <div class="x-flex x-flex-row x-gap-8">
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
