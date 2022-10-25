import Vue from 'vue';
import { PropValidator } from 'vue/types/options';
import { ExtendedVue } from 'vue/types/vue';

/**
 * Mixin that creates a string prop in the component for each element
 * within the array passed as `propNames` argument.
 *
 * @param propNames - Array with the names of the props to create.
 * @example
 * ```typescript
 *
 *   const nodes = ['list', 'listitem', 'tag'] as const;
 *
 *   @Component({
 *     components: { RelatedTag },
 *     mixins: [xComponentMixin(relatedTagsXModule)]
 *   })
 *   export default class RelatedTags extends mixins(
 *     dynamicPropsMixin<ExtractArrayItems<typeof nodes>>(nodes)
 *   ) {
 *   // This component will have available 3 props: 'list', 'listitem', 'tag'
 *   }
 * ```
 * @returns Mixin for the component.
 *
 */
export function dynamicPropsMixin<T extends string>(
  propNames: readonly string[]
): ExtendedVue<Vue, unknown, unknown, unknown, Record<T, string>> {
  return Vue.extend({
    props: propNames.reduce(
      (a, v) => ({ ...a, [v]: { type: String } }),
      {} as Record<T, PropValidator<string>>
    )
  });
}
