<template>
  <div>
    <SearchInput />

    <NextQueryPreview :suggestion="nextQueries[3]">
      <h1>Next query preview:</h1>
      <NextQuery :suggestion="nextQueries[3]" data-test="next-query-preview-name">
        <span>{{ nextQueries[3].query }}</span>
      </NextQuery>
    </NextQueryPreview>

    <NextQueries :max-items-to-render="3">
      <template #suggestion="{ suggestion }">
        <NextQuery :suggestion="suggestion">
          <span>{{ suggestion.query }}</span>
        </NextQuery>
      </template>
    </NextQueries>
  </div>
</template>

<script setup>
  import NextQueryPreview from '../../../../../x-components/src/x-modules/next-queries/components/next-query-preview.vue';
  import NextQuery from '../../../../../x-components/src/x-modules/next-queries/components/next-query.vue';
  import NextQueries from '../../../../../x-components/src/x-modules/next-queries/components/next-queries.vue';
  import { useState } from '../../../../../x-components/src/composables/use-state';
  import SearchInput from '../../../../../x-components/src/x-modules/search-box/components/search-input.vue';

  const { nextQueries } = useState('nextQueries', ['nextQueries']);
</script>
