<template>
  <main>
    <div class="x-column">
      <h1>Recommendations</h1>
      <Recommendations>
        <template #default="{ recommendation }">
          <BaseResultLink :result="recommendation" class="x-result-link">
            <template #default="{ result }">
              <img
                :src="result.images[0]"
                :alt="result.name"
                class="x-result_image x-column"
                data-test="recommendation-image"
              />
              <span class="x-result__title" data-test="recommendation-text">{{ result.name }}</span>
            </template>
          </BaseResultLink>
        </template>
      </Recommendations>
    </div>
  </main>
</template>

<script lang="ts">
  import { deepMerge } from '@empathyco/x-deep-merge';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseResultLink from '../components/result/base-result-link.vue';
  import { XInstaller } from '../x-installer/x-installer';
  import Recommendations from '../x-modules/recommendations/components/recommendations.vue';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(to, _from, next: () => void): void {
      const customQueryConfig = JSON.parse(to.query.xModules?.toString() ?? '{}');
      const configRecommendationsView = deepMerge(baseInstallXOptions, {
        xModules: customQueryConfig
      });
      new XInstaller(configRecommendationsView).init(baseSnippetConfig);
      next();
    },
    components: {
      BaseResultLink,
      Recommendations
    }
  })
  export default class RecommendationsView extends Vue {}
</script>

<style lang="scss">
  .x-column {
    display: inline-flex;
    flex-direction: column;
    width: 30%;
  }
</style>
