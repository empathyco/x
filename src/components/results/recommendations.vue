<template>
  <div>
    <h1>{{ $t('recommendations.title') }}</h1>
    <Recommendations
      #default="{ recommendation }"
      :animation="staggeredFadeAndSlide"
      class="x-recommendations"
    >
      <Result :result="recommendation" />
    </Recommendations>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { StaggeredFadeAndSlide } from '@empathy/x-components';
  import { Recommendations } from '@empathy/x-components/recommendations';
  import ResultComponent from './result.vue';

  @Component({
    components: {
      Recommendations,
      Result: ResultComponent
    }
  })
  //TODO: use BaseGrid when Recommendations are adapted (EX-3807) to in the next alpha release.
  export default class RecommendationsComponent extends Vue {
    protected staggeredFadeAndSlide = StaggeredFadeAndSlide;
  }
</script>

<style scoped>
  .x-recommendations {
    display: flex;
  }
</style>
