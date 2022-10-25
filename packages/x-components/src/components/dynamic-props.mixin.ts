import Vue from 'vue';
import { PropValidator } from 'vue/types/options';
import { ExtendedVue } from 'vue/types/vue';

/**
 * Dynamic props mixin.
 *
 * @param elements - The props names to create.
 *
 * @returns Extended vue.
 *
 */
export function dynamicPropsMixin<T extends string>(
  elements: readonly string[]
): ExtendedVue<Vue, unknown, unknown, unknown, Record<T, string>> {
  return Vue.extend({
    props: elements.reduce(
      (a, v) => ({ ...a, [v]: { type: String } }),
      {} as Record<T, PropValidator<string>>
    )
  });
}
