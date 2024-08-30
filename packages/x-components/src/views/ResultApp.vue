<template>
  <main>
    <div class="x-components-images">
      <BaseResultImage data-test="result-with-images" :result="resultWithImages">
        <template #placeholder>
          <div data-test="result-picture-placeholder">placeholder0</div>
        </template>
        <template #fallback>
          <div data-test="result-picture-fallback">fallback0</div>
        </template>
      </BaseResultImage>
      <BaseResultImage data-test="result-with-fail-images" :result="resultWithFailImages">
        <template #placeholder>
          <div data-test="result-picture-placeholder">placeholder1</div>
        </template>
        <template #fallback>
          <div data-test="result-picture-fallback">fallback1</div>
        </template>
      </BaseResultImage>
      <BaseResultImage
        data-test="result-with-fail-images-and-ok-images"
        :result="resultWithFailImagesAndOkImages"
      >
        <template #placeholder>
          <div data-test="result-picture-placeholder">placeholder2</div>
        </template>
        <template #fallback>
          <div data-test="result-picture-fallback">fallback2</div>
        </template>
      </BaseResultImage>
    </div>
    <BaseRating :value="2.5">
      <template #filled-icon>◼</template>
      <template #empty-icon>◻</template>
    </BaseRating>
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
  import { defineComponent } from 'vue';
  import { getResultsStub } from '../__stubs__/results-stubs.factory';
  import { getSearchResponseStub } from '../__stubs__/search-response-stubs.factory';
  import { BaseResultImage } from '../components';
  import StaggeredFadeAndSlide from '../components/animations/staggered-fade-and-slide.vue';
  import BaseRating from '../components/base-rating.vue';
  import BaseVariableColumnGrid from '../components/base-variable-column-grid.vue';
  import BaseColumnPickerList from '../components/column-picker/base-column-picker-list.vue';

  export default defineComponent({
    components: {
      BaseColumnPickerList,
      BaseRating,
      BaseResultImage,
      BaseVariableColumnGrid
    },
    setup() {
      const resultsStub = getResultsStub();
      const searchResponse = getSearchResponseStub();
      const searchResponseStub = [
        ...searchResponse.banners!,
        ...searchResponse.promoteds!,
        ...searchResponse.results
      ];
      const resultWithImages = resultsStub[0];
      const resultWithFailImages = resultsStub[1];
      const resultWithFailImagesAndOkImages = resultsStub[2];

      return {
        resultsStub,
        searchResponse,
        searchResponseStub,
        resultWithImages,
        resultWithFailImages,
        resultWithFailImagesAndOkImages,
        fade: StaggeredFadeAndSlide
      };
    }
  });
</script>

<style lang="css">
  .x-components-images {
    position: absolute;
    top: 1500px;
    display: flex;
    flex-direction: column;
  }

  .x-base-grid {
    column-gap: 10px;
    row-gap: 10px;
  }

  .x-base-grid__item {
    border: 1px solid black;
    padding: 20px;
    text-align: center;
  }

  .x-base-grid__next-queries {
    border-color: red;
    border-radius: 50px;
  }

  .x-base-grid__result {
    border-color: deepskyblue;
  }

  .x-base-grid__banner {
    border-color: blueviolet;
    grid-column: -1/1;
  }

  .x-base-grid__promoted {
    border-color: orange;
  }
</style>
