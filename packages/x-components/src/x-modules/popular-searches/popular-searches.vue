<template>
  <ul v-if="suggestions.length">
    <li v-for="suggestion in suggestions" :key="suggestion.term">
      <!-- @slot An individual popular search, that should call the emitPopularSearchSelected method
      when selected.
          @binding {Function} emitPopularSearchSelected - A method that emits multiple events related to the selection of a popular search
          @binding {Suggestion} suggestion - A single popular search to be used by the component
      -->
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
   * Simple popular-searches component that renders a list of suggestions, allowing the user to select one of them,
   * and emitting the needed events.
   * A popular search is just a query that has been searched a lot in a certain period of time, and that can optionally
   * have associated a set of filters.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(popularSearchesXModule)]
  })
  export default class PopularSearches extends Vue {
    @State('popularSearches', 'suggestions')
    public suggestions!: Suggestion[];

    /**
     * Emits a set of events related to the selection of a popular search
     *
     * @param suggestion - The popular search that has been selected
     * @public Can be used within the `popular-search` slot
     */
    protected emitPopularSearchSelected(suggestion: Suggestion): void {
      this.$x.emit('UserSelectedAQuery', suggestion.term);
      this.$x.emit('UserSelectedASuggestion', suggestion);
      this.$x.emit('UserSelectedAPopularSearch', suggestion);
    }
  }
</script>

<docs>
  #Examples

  ## Basic example

  You don't need to pass any props, or slots. Simply add the component, and when it has any popular searches it will show them

  ```vue
  <PopularSearches />
  ```

  ## Adding a custom popular search component

  You can use your custom implementation of a popular search component. To work correctly, it should use the `emitPopularSearchSelected` function when the popular search is selected.
  In the example below, instead of using the default `button` tag for a popular search, an icon is added, and the text of the popular search is wrapped in a `span`

  ```vue
  <PopularSearches>
    <template #popular-search="{suggestion, emitPopularSearchSelected }">
      <button @click="emitPopularSearchSelected(suggestion)" class="x-popular-search">
        <img src="./popular-search-icon.svg" class="x-popular-search__icon"/>
        <span class="x-popular-search__query">{{ suggestion.term }}</span>
      </button>
    </template>
  </PopularSearches>
  ```
</docs>
