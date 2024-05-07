<template>
  <LocationProvider location="results">
    <ResultsList>
      <PromotedsList>
        <BannersList>
          <NextQueriesList>
            <BaseGrid>
              <template #result="{ item: result }">
                {{ result.id }}
              </template>

              <template #banner="{ item: banner }">
                {{ banner.id }}
              </template>

              <template #promoted="{ item: promoted }">
                {{ promoted.title }}
              </template>
              <template #next-queries-group="{ item: { nextQueries } }">
                <li v-for="nextQuery in nextQueries" :key="nextQuery.query" class="next-query">
                  {{ nextQuery.query }}
                </li>
              </template>
            </BaseGrid>
          </NextQueriesList>
        </BannersList>
      </PromotedsList>
    </ResultsList>
  </LocationProvider>
</template>

<script setup lang="ts">
  // eslint-disable-next-line max-len
  import PromotedsList from '../../../../../x-components/src/x-modules/search/components/promoteds-list.vue';
  // eslint-disable-next-line max-len
  import ResultsList from '../../../../../x-components/src/x-modules/search/components/results-list.vue';
  // eslint-disable-next-line max-len
  import BannersList from '../../../../../x-components/src/x-modules/search/components/banners-list.vue';
  import BaseGrid from '../../../../../x-components/src/components/base-grid.vue';
  import LocationProvider from '../../../../../x-components/src/components/location-provider.vue';
  // eslint-disable-next-line max-len
  import NextQueriesList from '../../../../../x-components/src/x-modules/next-queries/components/next-queries-list.vue';
</script>
