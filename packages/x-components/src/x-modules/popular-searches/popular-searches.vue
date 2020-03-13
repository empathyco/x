<template>
  <ul v-if="suggestions.length">
    <li v-for="suggestion in suggestions" :key="suggestion.term">
      <slot name="popular-search" v-bind="{ suggestion, emitPopularSearchSelected }">
        <button @click="emitPopularSearchSelected(suggestion)" class="x-popular-search">
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
  import { popularSearchesXModule } from './x-module';

  /**
   * Simple popular-searches component that allows the user to select a popular search, emitting
   * the needed events
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(popularSearchesXModule)]
  })
  export default class PopularSearches extends Vue {
    @State('popularSearches', 'suggestions')
    public suggestions!: Suggestion[];

    protected emitPopularSearchSelected(suggestion: Suggestion): void {
      this.$x.emit('UserSelectedAQuery', suggestion.term);
      this.$x.emit('UserSelectedASuggestion', suggestion);
      this.$x.emit('UserSelectedAPopularSearch', suggestion);
    }
  }
</script>
