<template>
  <ul v-if="nextQueries.length">
    <li v-for="nextQuery in nextQueries" :key="nextQuery.query">
      <!-- @slot An individual next query, that should call the emitNextQuerySelected method when
       selected.
          @binding {Function} emitNextQuerySelected - A method that emits multiple events related
          to the selection of a next query
          @binding {NextQuery} nextQuery - A single next query to be used by the component
      -->
      <slot name="next-query" v-bind="{ nextQuery, emitNextQuerySelected }">
        <button @click="emitNextQuerySelected(nextQuery)" class="x-next-query">
          {{ nextQuery.query }}
        </button>
      </slot>
    </li>
  </ul>
</template>

<script lang="ts">
  import { NextQuery } from '@empathy/search-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../components/decorators';
  import { xComponentMixin } from '../../components/x-component.mixin';
  import { nextQueriesXModule } from './x-module';

  /**
   * Simple next-queries component that renders a list of suggestions, allowing the user to
   * select one of them, and emitting the needed events.
   * A next query is a suggestion for a new search, related to your previous query. I.e. If
   * people normally search for `shirts`, and then `trousers`, `trousers` would be a next query
   * of `shirts`.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(nextQueriesXModule)]
  })
  export default class NextQueries extends Vue {
    @State('nextQueries', 'nextQueries')
    public nextQueries!: NextQuery[];

    /**
     * Emits a set of events related to the selection of a next-query.
     *
     * @param nextQuery - The next query that has been selected.
     * @public Can be used within the `next-query` slot.
     */
    protected emitNextQuerySelected(nextQuery: NextQuery): void {
      this.$x.emit('UserAcceptedAQuery', nextQuery.query);
      this.$x.emit('UserSelectedANextQuery', nextQuery);
    }
  }
</script>

<docs>
  #Examples

  ## Basic example

  You don't need to pass any props, or slots. Simply add the component, and when it has any next
  queries it will show them

  ```vue
  <NextQueries />
  ```

  ## Adding a custom next query component

  You can use your custom implementation of a next query component. To work correctly, it should
  use the `emitNextQuerySelected` function when the next query is selected.
  In the example below, instead of using the default `button` tag for a next query, an icon is
  added, and the text of the next query is wrapped in a `span`
  ```vue
  <NextQueries>
    <template #next-query="{nextQuery, emitNextQuerySelected }">
      <button @click="emitNextQuerySelected(nextQuery)" class="x-next-query">
        <img src="./next-query-icon.svg" class="x-next-query__icon"/>
        <span class="x-next-query__query">{{ nextQuery.query }}</span>
      </button>
    </template>
  </NextQueries>
  ```
</docs>
