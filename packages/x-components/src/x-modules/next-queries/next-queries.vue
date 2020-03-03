<template>
  <ul v-if="nextQueries.length">
    <li v-for="nextQuery in nextQueries" :key="nextQuery.query">
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
   * Simple next-queries component that allows the user to select a next query, emitting
   * the needed events
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(nextQueriesXModule)]
  })
  export default class NextQueries extends Vue {
    @State('nextQueries', 'nextQueries')
    nextQueries!: NextQuery[];

    protected emitNextQuerySelected(nextQuery: NextQuery) {
      this.$x.emit('UserSelectedAQuery', nextQuery.query);
      this.$x.emit('UserSelectedANextQuery', nextQuery);
    }
  }
</script>
