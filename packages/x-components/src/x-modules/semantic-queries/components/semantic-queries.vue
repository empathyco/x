<template>
  <NoElement>
    <slot name="default" :queries="queries">
      <ul class="x-semantic-queries">
        <li
          v-for="semanticQuery in $x.semanticQueries"
          :key="semanticQuery.query"
          data-test="semantic-query"
        >
          <slot name="item" :query="semanticQuery">
            {{ semanticQuery.query }} - {{ semanticQuery.distance }}
          </slot>
        </li>
      </ul>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { semanticQueriesXModule } from '../x-module';
  import { NoElement } from '../../../components/no-element';

  @Component({
    mixins: [xComponentMixin(semanticQueriesXModule)],
    components: { NoElement }
  })
  export default class SemanticQueries extends Vue {
    public get queries(): string[] {
      return this.$x.semanticQueries.map(semanticQuery => semanticQuery.query);
    }
  }
</script>
