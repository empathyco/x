<template>
  <div>
    <h1>{{ $t('identifierResults.title') }}</h1>
    <IdentifierResults :animation="identifierResultsAnimation">
      <template #default="{ identifierResult }">
        <BaseResultLink :result="identifierResult">
          <template #default="{ result }">
            <IdentifierResult :result="result" />
          </template>
        </BaseResultLink>
      </template>
    </IdentifierResults>
  </div>
</template>

<script lang="ts">
  import { IdentifierResults, IdentifierResult } from '@empathy/x-components/identifier-results';
  import { BaseResultLink, FadeAndSlide } from '@empathy/x-components';
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    components: {
      BaseResultLink,
      IdentifierResults,
      IdentifierResult,
      FadeAndSlide
    }
  })
  export default class IdentifierResultsComponent extends Vue {
    protected identifierResultsAnimation = FadeAndSlide;
  }
</script>
