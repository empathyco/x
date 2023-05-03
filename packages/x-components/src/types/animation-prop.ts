import { DefineComponent, PropType } from 'vue';

/**
 * Type for animations props.
 *
 * @public
 */
export const AnimationProp = [String, Object, Function] as PropType<DefineComponent | string>;
