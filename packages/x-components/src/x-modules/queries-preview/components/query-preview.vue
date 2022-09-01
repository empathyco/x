<template>
  <NoElement v-if="queryPreviewResults && queryPreviewResults.totalResults">
    <!--
      @slot Query Preview default slot.
          @binding {QueryPreview} query - query
          @binding {Result[]} results - The results preview of the query preview
          @binding {number} totalResults - The total results of the search request
    -->
    <slot
      :query="query"
      :results="queryPreviewResults.results"
      :totalResults="queryPreviewResults.totalResults"
    >
      <ul data-test="query-preview" class="x-query-preview">
        <li
          v-for="result in queryPreviewResults.results"
          :key="result.id"
          class="x-query-preview__item"
          data-test="query-preview-item"
        >
          <!--
          @slot Query Preview result slot.
              @binding {Result} result - A Query Preview result
        -->
          <slot name="result" :result="result">
            <span data-test="result-name">{{ result.name }}</span>
          </slot>
        </li>
      </ul>
    </slot>
  </NoElement>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Dictionary } from '@empathyco/x-utils';
  import { SearchRequest, Result } from '@empathyco/x-types';
  import { State } from '../../../components/decorators/store.decorators';
  import { LIST_ITEMS_KEY } from '../../../components/decorators/injection.consts';
  import { XProvide } from '../../../components/decorators/injection.decorators';
  import { XEmit } from '../../../components/decorators/bus.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { NoElement } from '../../../components/no-element';
  import { QueryOrigin } from '../../../types/origin';
  import { QueryPreviewItem } from '../store/types';
  import { QueriesPreviewConfig } from '../config.types';
  import { queriesPreviewXModule } from '../x-module';

  /**
   * Retrieves a preview of the results of a query preview and exposes them in the default slot,
   * along with the query preview and the totalResults of the search request.
   * By default, it renders the names of the results.
   *
   * @public
   */
  @Component({
    components: {
      NoElement
    },
    mixins: [xComponentMixin(queriesPreviewXModule)]
  })
  export default class QueryPreview extends Vue {
    /**
     * The query preview to retrieve the results preview.
     *
     * @public
     */
    @Prop({
      required: true
    })
    protected query!: string;

    /**.
     *  The origin property for the request
     *
     * @public
     */
    @Prop()
    protected queryOrigin!: QueryOrigin;

    /**
     * Number of query preview results to be rendered.
     *
     * @public
     */
    @Prop()
    protected maxItemsToRender?: number;

    /**
     * The results preview of the queries preview mounted.
     * It is a dictionary, indexed by the query preview query.
     */
    @State('queriesPreview', 'queriesPreview')
    public previewResults!: Dictionary<QueryPreviewItem>;

    /**
     * As the request is handled in this component, we need
     * the extra params that will be used in the request.
     */
    @State('queriesPreview', 'params')
    public params!: Dictionary<unknown>;

    /**
     * As the request is handled in this component, we need
     * the config that will be used in the request.
     */
    @State('queriesPreview', 'config')
    public config!: QueriesPreviewConfig;

    /**
     * The results to render from the state.
     *
     * @remarks The results list are provided with `items` key. It can be
     * concatenated with list items from components such as `BannersList`, `PromotedsList`,
     * `BaseGrid` or any component that injects the list.
     *
     * @returns A list of results.
     * @public
     */
    @XProvide(LIST_ITEMS_KEY)
    public get results(): Result[] | undefined {
      return this.queryPreviewResults?.results;
    }

    /**
     * The computed request object to be used to retrieve the query preview results.
     *
     * @returns The search request object.
     * @public
     */
    @XEmit('QueryPreviewRequestChanged', { immediate: false })
    public get queryPreviewRequest(): SearchRequest {
      return {
        query: this.query,
        rows: this.config.maxItemsToRequest,
        origin: this.queryOrigin,
        extraParams: this.params
      };
    }

    protected mounted(): void {
      this.$x.emit('QueryPreviewRequestChanged', this.queryPreviewRequest);
    }

    /**
     * Gets from the state the results preview of the query preview.
     *
     * @returns The results preview of the actual query preview.
     */
    public get queryPreviewResults(): QueryPreviewItem | undefined {
      const previewResults = this.previewResults[this.query];
      return previewResults?.results
        ? {
            ...previewResults,
            results: previewResults.results.slice(0, this.maxItemsToRender)
          }
        : undefined;
    }
  }
</script>
