import { Sort } from '@empathyco/x-types';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { State, XEmit } from '../../../components';

/**
 * Mixin to share Sort logic.
 *
 * @public
 */
@Component
export default class SortMixin extends Vue {
  /**
   * The list of possible sort values. If the {@link SortMixin.value} option
   * is not provided, the first item of this list will be selected.
   *
   * @public
   */
  @Prop({ required: true })
  public items!: Sort[];

  /**
   * The search module selected sort. This is the source of truth when checking which
   * sort is selected.
   *
   * @internal
   */
  @State('search', 'sort')
  public selectedSort!: Sort;

  /**
   * Emits the {@link SearchXEvents.SelectedSortProvided | SelectedSortProvided} event whenever the
   * provided {@link SortMixin.value} changes. If no value is provided, the first item of the
   * {@link SortMixin.items} will be used as fallback.
   *
   * @returns The sorting value.
   *
   * @public
   */
  @XEmit('SelectedSortProvided')
  public get providedSelectedSort(): Sort {
    return this.selectedSort ?? this.items[0];
  }
}
