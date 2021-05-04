<template>
  <div>
    <h1>{{ $t('querySuggestions.title') }}</h1>
    <QuerySuggestions :animation="querySuggestionsAnimation" :max-items-to-render="5" />
  </div>
</template>

<script lang="ts">
  import { FadeAndSlide } from '@empathy/x-components';
  import { QuerySuggestions } from '@empathy/x-components/query-suggestions';
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    components: {
      QuerySuggestions
    }
  })
  export default class QuerySuggestionsComponent extends Vue {
    public querySuggestionsAnimation = FadeAndSlide;
  }
</script>
