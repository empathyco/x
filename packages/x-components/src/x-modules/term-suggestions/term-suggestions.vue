<template>
  <ul v-if="suggestions.length">
    <li v-for="suggestion in suggestions" :key="suggestion.term">
      <slot name="term-suggestion" v-bind="{ suggestion, emitSuggestionSelected }">
        <button @click="emitSuggestionSelected(suggestion)" class="x-term-suggestion">
          {{ suggestion.term }}
        </button>
      </slot>
    </li>
  </ul>
</template>

<script lang="ts">
  import { Suggestion } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../components/decorators';
  import { xComponentMixin } from '../../components/x-component.mixin';
  import { termSuggestionsXModule } from './x-module';

  /**
   * Simple term-suggestions component that allows the user to select a suggestion, emitting
   * the needed events
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(termSuggestionsXModule)]
  })
  export default class TermSuggestions extends Vue {
    @State('termSuggestions', 'suggestions')
    suggestions!: Suggestion[];

    protected emitSuggestionSelected(suggestion: Suggestion) {
      this.$x.emit('UserSelectedAQuery', suggestion.term);
      this.$x.emit('UserSelectedASuggestion', suggestion);
      this.$x.emit('UserSelectedATermSuggestion', suggestion);
    }
  }
</script>
