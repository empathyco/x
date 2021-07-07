import { Filter } from '@empathyco/x-types';
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { XInject } from '../../../../components/decorators/injection.decorators';

/**
 * Mixin to share filters injection logic.
 *
 * @public
 */
@Component
export default class FiltersInjectionMixin extends Vue {
  /**
   * The list of filters to be rendered as slots.
   *
   * @public
   */
  @Prop()
  protected filters!: Filter[];
  /** The injected filters array.
   *
   * @public
   */
  @XInject('filters')
  public injectedFilters!: Filter[];

  /**
   * An array of filters formed by those that are passed through prop or injected.
   *
   * @returns An array of filters.
   *
   * @internal
   */
  protected get renderedFilters(): Filter[] {
    return (
      this.filters ??
      this.injectedFilters ??
      //TODO: add here logger
      //eslint-disable-next-line no-console
      console.warn('It is necessary to pass a prop or inject the list of filters')
    );
  }
}
