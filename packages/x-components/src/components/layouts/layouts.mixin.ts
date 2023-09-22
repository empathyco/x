import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';

/**
 * Mixin to share layouts logic.
 *
 * @public
 */
@Component
export default class LayoutsMixin extends Vue {
  /**
   * Enables the devMode, which shows the available slots to use with its names.
   *
   * @public
   */
  @Prop({ default: false })
  protected devMode!: boolean;

  /**
   * Function to check if an slot has rendered content or not.
   *
   * @param slotNames - A VNode Array with of each slot.
   * @returns True if the slot has rendered content or false otherwise.
   *
   * @internal
   */
  protected hasContent(...slotNames: string[]): boolean {
    return (
      (this.devMode ||
        slotNames.some(slotName =>
          this.$scopedSlots[slotName]?.(undefined)?.some(vNode => vNode.tag !== undefined)
        )) ??
      false
    );
  }
}
