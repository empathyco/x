import { PropValidator } from 'vue/types/options';

/**
 * Generates props.
 *
 * @param elements - The props names to create.
 *
 * @returns An object.
 */
export function generateProps<T extends string[number]>(
  elements: readonly string[]
): Record<T, PropValidator<string>> {
  return elements.reduce(
    (a, v) => ({ ...a, [v]: { type: String } }),
    {} as Record<T, PropValidator<string>>
  );
}

// export function dynamicPropsMixin<T extends string[number]>(
//   elements: readonly string[]
// ): VueConstructor {
//   return Vue.extend({
//     props: elements.reduce((a, v) => ({ ...a, [v]: { type: String } }), {}) as Record<
//       T,
//       PropValidator<string>
//     >
//   });
// }
//
// const elements = ['list', 'listitem', 'tag'] as const;
// type extendedProps = typeof elements[number];
// export const propsMixin = Vue.extend({
//   props: elements.reduce((a, v) => ({ ...a, [v]: { type: String } }), {}) as Record<
//     extendedProps,
//     PropValidator<string>
//   >
// });
