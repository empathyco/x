import { h, SetupContext, VNode } from 'vue';

/**
 * Returns a render function that returns the default slot or nothing if it's not defined.
 *
 * @param slots - The slots object from the component.
 * @returns The result of the rendering function to use.
 *
 * @public
 */
export function useNoElementRender(
  slots: { [key: string]: VNode[] | undefined } | SetupContext['slots']
): VNode | VNode[] | string {
  const defaultSlotContent = typeof slots.default === 'function' ? slots.default() : slots.default;

  return defaultSlotContent ?? '';
}
