<template>
  <NextQueryPreview
    :suggestion="suggestion"
    #default="{ results, totalResults, suggestion }"
    class="x-flex x-flex-col x-gap-8"
  >
    <h1 class="x-title2">Others clients have searched</h1>
    <NextQuery class="x-suggestion x-text1 x-text1-lg" :suggestion="suggestion">
      <span class="x-font-bold">{{ suggestion.query }}</span>
      ({{ totalResults }})
    </NextQuery>
    <SlidingPanel :resetOnContentChange="false">
      <div class="x-flex x-flex-col x-gap-8">
        <Result
          v-for="result in results"
          :key="result.id"
          :result="result"
          style="max-width: 180px"
        />
      </div>
    </SlidingPanel>
  </NextQueryPreview>
</template>

<script lang="ts">
  import { Component, Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import { NextQuery as NextQueryModel } from '@empathyco/x-types';
  import NextQueryPreview from '../../x-modules/next-queries/components/next-query-preview.vue';
  import NextQuery from '../../x-modules/next-queries/components/next-query.vue';
  import SlidingPanel from '../../components/sliding-panel.vue';
  import Result from './result.vue';

  @Component({
    components: {
      NextQueryPreview,
      NextQuery,
      SlidingPanel,
      Result
    }
  })
  export default class SlidingNextQueryPreview extends Vue {
    @Prop({
      required: true
    })
    public suggestion!: NextQueryModel;
  }
</script>
