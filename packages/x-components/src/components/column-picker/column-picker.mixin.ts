import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { XEmit, XOn } from '../decorators/bus.decorators';

/**
 * Mixin to share Column Pickers logic.
 *
 * @public
 */
@Component({
  model: {
    event: 'change'
  }
})
export default class ColumnPickerMixin extends Vue {
  /**
   * The value of the selected columns number.
   *
   * @public
   */
  @Prop({ required: false })
  protected value?: number;

  /**
   * An array of numbers that represents the number of columns to render.
   *
   * @public
   */
  @Prop({ required: true })
  protected columns!: number[];

  /**
   * Selected column, `value` prop by default or the first `columns` item.
   *
   * @internal
   */
  @XEmit('ColumnsNumberProvided', { immediate: false })
  public selectedColumns = this.providedSelectedColumns;

  /**
   * Retrieves the provided selected column.
   *
   * @returns The provided `value`, or the first value of the list of possible columns.
   * @internal
   */
  public get providedSelectedColumns(): number {
    return this.value ?? this.columns[0];
  }

  /**
   * Synchronizes the selected column with the one provided by argument.
   *
   * @param columns - The column number.
   *
   * @internal
   */
  @Watch('providedSelectedColumns')
  @XOn('ColumnsNumberProvided')
  setSelectedColumns(columns: number): void {
    this.selectedColumns = columns;
  }

  /**
   * Synchronizes the number of selected columns with the provided selected column value.
   *
   * @param column - The new number of columns.
   *
   * @internal
   */
  @Watch('selectedColumns')
  protected emitChange(column: number): void {
    if (this.value !== column) {
      this.$emit('change', column);
    }
  }

  /**
   * Synchronizes the columns number before mounting the component. If the real number of selected
   * columns equals the provided columns, it emits the event to sync it with every other component.
   * If it is not equal it means that the user has already selected a number of columns, so we emit
   * a `change` event so developers can sync the provided value.
   *
   * @internal
   */
  beforeMount(): void {
    if (this.selectedColumns === this.providedSelectedColumns) {
      this.$x.emit('ColumnsNumberProvided', this.selectedColumns);
    } else {
      this.emitChange(this.selectedColumns);
    }
  }
}
