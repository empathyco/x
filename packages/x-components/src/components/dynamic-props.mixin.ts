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
 *   @Component({
 *     components: { RelatedTag },
 *     mixins: [xComponentMixin(relatedTagsXModule)]
 *   })
 *   export default class RelatedTags extends Mixins(dynamicPropsMixin(['list', 'li', 'tag'])) {
 *   // This component will have available 3 props: 'list', 'li' and 'tag'
 *   }
 * ```
 * @returns Mixin for the component.
 *
 */
export function dynamicPropsMixin<PropNames extends string>(
  propNames: PropNames[]
): ExtendedVue<Vue, unknown, unknown, unknown, Partial<Record<PropNames, string>>> {
  return Vue.extend({
    props: propNames.reduce(
      (props, propName) => ({ ...props, [propName]: { type: String } }),
      {} as Record<PropNames, PropValidator<string>>
    )
  });
}
