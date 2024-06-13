<template>
  <SemanticQueries #default="{ suggestions, findSemanticQuery }">
    <QueryPreviewList
      :queriesPreviewInfo="suggestions"
      #default="{ queryPreviewInfo: { query }, totalResults, results }"
    >
      <div>
        <SemanticQuery :suggestion="findSemanticQuery(query)">
          <span>{{ query }} ({{ totalResults }})</span>
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
