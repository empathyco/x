<template>
  <ul v-if="suggestions.length">
    <li v-for="suggestion in suggestions" :key="suggestion.term">
      <button @click="emitSuggestionSelected(suggestion)">
        {{ suggestion.term }}
      </button>
    </li>
  </ul>
</template>
<script lang="ts">
import { Suggestion } from '@empathy/search-types';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { XPlugin } from '../../plugins';
import { termSuggestionsXModule } from './x-module';

XPlugin.registerXModule(termSuggestionsXModule);
@Component({
  computed: {
    ...mapState('x/termSuggestions', ['suggestions'])
  }
})
export default class TermSuggestions extends Vue {
  suggestions!: Suggestion[];

  protected emitSuggestionSelected(suggestion: Suggestion) {
    this.$x.emit('UserSelectedAQuery', suggestion.term);
    this.$x.emit('UserSelectedASuggestion', suggestion);
    this.$x.emit('UserSelectedATermSuggestion', suggestion);
  }
}
</script>
