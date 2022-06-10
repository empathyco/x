import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';

/**
 * Contains common props used by the suggestions components.
 */
@Component
export class SuggestionsMixin extends Vue {
  /**
   * Animation component that will be used to animate the suggestion.
   *
   * @public
   */
  @Prop({ default: 'ul' })
  protected animation!: Vue | string;

  /**
   * Number of suggestions to be rendered.
   *
   * @public
   */
  @Prop()
  protected maxItemsToRender?: number;
}
