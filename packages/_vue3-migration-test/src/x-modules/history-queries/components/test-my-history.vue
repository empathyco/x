<template>
  <MyHistory v-if="_$x.isHistoryQueriesEnabled && _$x.fullHistoryQueries.length">
    <template #date="{ date }">
      <div>{{ date }}</div>
    </template>

    <template #suggestion="{ suggestion, formatTime }">
      <HistoryQuery data-test="my-history-query" :suggestion="suggestion">
        <div class="flex flex-row gap-8">
          <p>{{ suggestion.query }}</p>

          <p>
            {{ formatTime(suggestion.timestamp) }}
          </p>
        </div>

        <template #remove-button-content>
          <span>x</span>
        </template>
      </HistoryQuery>
    </template>
  </MyHistory>
</template>

<script setup>
  import HistoryQuery from '../../../../../x-components/src/x-modules/history-queries/components/history-query.vue';
  import MyHistory from '../../../../../x-components/src/x-modules/history-queries/components/my-history.vue';
  import { use$x } from '../../../../../x-components/src/composables/use-$x';

  const _$x = use$x();
</script>

<style scoped></style>
