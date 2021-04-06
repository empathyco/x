import { Sort } from '@empathy/search-types';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { State } from '../../../components';

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
   * The selected sort value. This is an optional prop that allows to change programmatically
   * the selected sort. If it is not provided, the first item of the {@link SortMixin.items}
   * list will be selected.
   *
   * @public
   */
  @Prop()
  public value?: Sort;

  /**
   * Registers the needed watchers to sync the state with the props.
   *
   * @internal
   */
  created(): void {
    /* Watcher is defined here because the `$x` object isn't created until this hook */
    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.$watch('value', this.emitProvidedValueChanged, { immediate: true });
  }

  /**
   * Emits the {@link SearchXEvents.SelectedSortProvided} event if the provided sort differs
   * from the state selected sort.
   *
   * @param sort - The provided sort.
   * @internal
   */
  protected emitProvidedValueChanged(sort: Sort = this.items[0]): void {
    if (sort !== this.selectedSort) {
      this.$x.emit('SelectedSortProvided', sort, { target: this.$el as HTMLElement });
    }
  }

  /**
   * If there is no value provided, and the items has changed, it selects the first one of
   * the `items`.
   *
   * @param items - The new possible sort values.
   * @internal
   */
  @Watch('items')
  protected syncSelectedItem(items: Sort[]): void {
    if (this.value === undefined) {
      this.emitProvidedValueChanged(items[0]);
    }
  }
}
