<template>
  <Spellcheck>
    <template #default="{ query }">
      No results found for '{{ query }}'. We show you results for
      <SpellcheckButton />
    </template>
  </Spellcheck>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Spellcheck, SpellcheckButton } from '@empathy/x-components/search';

  @Component({
    components: {
      Spellcheck,
      SpellcheckButton
    }
  })
  export default class SpellcheckComponent extends Vue {}
</script>
