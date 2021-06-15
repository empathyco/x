import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { XOn } from '../decorators/bus.decorators';

/**
 * Mixin to share Column Pickers logic.
 *
 * @public
 */
@Component
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
  protected selectedColumn = this.value ?? this.columns[0];

  /**
   * It sets `selectedColumn` value with `value` prop when it changes and emits an  event if it
   * has changed.
   *
   * @param column - New value column.
   *
   * @internal
   */
  @Watch('value')
  protected onValueChange(column: number): void {
    if (column && !isNaN(column) && this.selectedColumn !== column) {
      this.selectedColumn = column;
      this.$x.emit('UserClickedColumnPicker', column);
    }
  }

  /**
   * It sets the selected column with the one provided by argument and emits an `input` event if it
   * has changed.
   *
   * @param column - The column number.
   *
   * @public
   */
  @XOn(['UserClickedColumnPicker', 'ColumnPickerSetColumnsNumber'])
  selectColumn(column: number): void {
    if (this.selectedColumn !== column) {
      this.$emit('input', column);
      this.selectedColumn = column;
    }
  }

  /**
   * It emits the initial selectedColumn value because the value watcher has a condition to avoid
   * emitting the {@link XEventsTypes.ColumnPickerSetColumnsNumber} if it's not different.
   *
   * @internal
   */
  mounted(): void {
    this.$x.emit('ColumnPickerSetColumnsNumber', this.selectedColumn);
  }
}
