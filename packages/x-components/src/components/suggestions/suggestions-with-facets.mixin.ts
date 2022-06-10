import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';

/**
 * Contains common props used by the suggestions components that can contain facets.
 */
@Component
export class SuggestionsWithFacetsMixin extends Vue {
  /**
   * Indicates if the suggestions must be rendered along with its facets.
   *
   * @public
   */
  @Prop({ default: false, type: Boolean })
  protected showFacets!: boolean;

  /**
   * When showFacets is true, indicates if the suggestion without filter
   * must be appended to the list.
   *
   * @public
   */
  @Prop({ default: false, type: Boolean })
  protected appendSuggestionWithoutFilter!: boolean;
}
