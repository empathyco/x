<template>
  <ul v-if="nextQueries.length">
    <li v-for="nextQuery in nextQueries" :key="nextQuery.query">
      <button @click="emitNextQuerySelected(nextQuery)">
        {{ nextQuery.query }}
      </button>
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
