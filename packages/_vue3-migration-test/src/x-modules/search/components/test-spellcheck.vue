<template>
  <SearchInput />
  <Spellcheck v-if="input">
    <template #default="{ query }">
      No results found for '{{ query }}'. We show you results for
      <SpellcheckButton />
    </template>
  </Spellcheck>
</template>

<script setup>
  import SpellcheckButton from '../../../../../x-components/src/x-modules/search/components/spellcheck-button.vue';
  import Spellcheck from '../../../../../x-components/src/x-modules/search/components/spellcheck.vue';
  import SearchInput from '../../../../../x-components/src/x-modules/search-box/components/search-input.vue';
  import { useState } from '../../../../../x-components/src/composables/use-state';

  const input = useState('search', ['query']).query;
</script>

<style scoped></style>
