import { VNode } from 'vue';
import { Slots } from 'vue/types/v3-setup-context';
/**
 * Composable to share Layout logic.
 *
 * @param devMode - Shows the available slots to use with its names if it is enabled.
 * @param slots - Slots to show.
 *
 * @returns True if the slot has rendered content or false otherwise.
 * @public
 */
export function useLayouts(devMode: boolean, slots: Slots) {
  /**
   * Function to check if an slot has rendered content or not.
   *
   * @param slotNames - A VNode Array with of each slot.
   * @returns True if the slot has rendered content or false otherwise.
   *
   * @internal
   */
  const hasContent = (...slotNames: string[]): boolean => {
    return (
      (devMode ||
        slotNames.some(slotName =>
          slots[slotName]?.(undefined)?.some((vNode: VNode) => vNode.tag !== undefined)
        )) ??
      false
    );
  };

  return { hasContent };
}
