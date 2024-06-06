<template>
  <SemanticQueries #default="{ queries, findSemanticQuery }">
    <QueryPreviewList
      :queries-preview-info="queries.map(q => ({ query: q }))"
      #default="{ queryPreviewInfo: { query }, results }"
      queryFeature="semantics"
    >
      <div
        class="x-flex x-flex-col x-gap-8 x-mb-16"
        data-test="semantic-query-preview"
        :data-query="query"
      >
        <SemanticQuery
          class="x-suggestion x-title2 x-title2-md"
          :suggestion="findSemanticQuery(query)"
          #default="{ suggestion: { query } }"
        >
          <span data-test="semantic-queries-query">{{ query }}</span>
        </SemanticQuery>
        <ul v-for="result in results" :key="result.id">
          <li>{{ result.id }}</li>
        </ul>
      </div>
    </QueryPreviewList>
  </SemanticQueries>
</template>

<script setup>
  import SemanticQueries from '../../../../../x-components/src/x-modules/semantic-queries/components/semantic-queries.vue';
  import QueryPreviewList from '../../../../../x-components/src/x-modules/queries-preview/components/query-preview-list.vue';
  import SemanticQuery from '../../../../../x-components/src/x-modules/semantic-queries/components/semantic-query.vue';
</script>
