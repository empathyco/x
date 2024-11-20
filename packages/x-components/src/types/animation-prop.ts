import { DefineComponent, PropType } from 'vue';

/**
 * Type for animations props.
 *
 * @public
 */
export const AnimationProp = [String, Object, Function] as PropType<
  // eslint-disable-next-line @typescript-eslint/ban-types
  DefineComponent<{}, {}, any> | string
>;
