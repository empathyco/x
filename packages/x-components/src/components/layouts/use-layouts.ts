import { SetupContext, VNode } from 'vue';
export function useLayouts(
  /**
   * Enables the devMode, which shows the available slots to use with its names.
   *
   * @public
   */
  devMode: boolean,
  context: SetupContext<any>
) {
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
          context.slots[slotName]?.(undefined)?.some((vNode: VNode) => vNode.tag !== undefined)
        )) ??
      false
    );
  };

  return { hasContent };
}
