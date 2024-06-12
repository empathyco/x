<template>
  <span style="display: block">
    Query:
    <b>{{ query }}</b>
  </span>
  <SearchInput />
  <RelatedTags />
</template>

<script setup>
  import SearchInput from '../../../../x-components/src/x-modules/search-box/components/search-input.vue';
  import RelatedTags from '../../../../x-components/src/x-modules/related-tags/components/related-tags.vue';

  import { useGetter } from '../../../../x-components/src/composables/use-getter';

  const { query } = useGetter('relatedTags', ['query']);
</script>
