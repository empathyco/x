<template>
  <SnippetConfigExtraParams :values="{ store: 'portugal' }" />
  <RenderlessExtraParam name="store" #default="{ value, updateValue }">
    <BaseDropdown @update:modelValue="updateValue" :modelValue="value" :items="items" />
  </RenderlessExtraParam>
  {{ params }}
</template>
<script setup lang="ts">
  import RenderlessExtraParam from '../../../../x-components/src/x-modules/extra-params/components/renderless-extra-param.vue';
  import SnippetConfigExtraParams from '../../../../x-components/src/x-modules/extra-params/components/snippet-config-extra-params.vue';
  import BaseDropdown from '../../../../x-components/src/components/base-dropdown.vue';
  import { useState } from '../../../../x-components/src/composables/use-state';

  const items = ['spain', 'portugal', 'italy'];
  const { params } = useState('extraParams', ['params']);
</script>
