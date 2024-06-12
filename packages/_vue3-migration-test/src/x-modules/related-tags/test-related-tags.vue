<template>
  <span>
    Query:
    <b>{{ query }}</b>
  </span>
  <RelatedTags />
</template>

<script setup>
  import RelatedTags from '../../../../x-components/src/x-modules/related-tags/components/related-tags.vue';
  import { useGetter } from '../../../../x-components/src/composables/use-getter';

  const { query } = useGetter('relatedTags', ['query']);
</script>
