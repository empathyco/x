import Vue, { ComponentOptions } from 'vue';
import { ReactRenderProps, ReactWrapperProps } from './react-wrapper.types';

/**
 * Checks if the slot content is {@link ReactRenderProps}.
 *
 * @param slotContent - The slot content to test if it is a {@link ReactRenderProps}.
 * @returns True if the slotContent is a ReactRenderProps.
 */
export function isScopedSlot(slotContent: unknown): slotContent is ReactRenderProps {
  return typeof slotContent === 'function';
}

/**
 * Helper function to define a Vue component in a type safe way.
 *
 * @param options - The component options.
 * @returns The same component options.
 */
export function defineComponent<
  Data extends () => Record<string, unknown>,
  Methods,
  Computed,
  PropsDef,
  Props
>(
  options: ComponentOptions<Vue, Data, Methods, Computed, PropsDef, Props> &
    ThisType<Vue & ReturnType<Data> & Methods & Computed & PropsDef & Props>
): ComponentOptions<Vue, Data, Methods, Computed, PropsDef, Props> {
  return options;
}

/**
 * Extracts the React props used in the wrapper and returns the rest which are props of the Vue
 * component rendered into.
 *
 * @param reactProps - The react props passed through the wrapper.
 * @returns The Vue props passes through the React wrapper.
 */
export function getVueComponentProps(reactProps: Readonly<ReactWrapperProps>): Record<string, any> {
  const { component, slots, children, on, ...vueProps } = reactProps;
  return vueProps;
}
