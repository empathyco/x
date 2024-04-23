import { defineComponent } from 'vue';
import { useNoElementRender } from '../composables/use-no-element-render';

/**
 * The purpose of this Component is to use as default value for props that receive a Component that
 * doesn't render any DOM element. For example the animations with `Transition` component.
 *
 * @internal
 */
export const NoElement = defineComponent({
  render() {
    return useNoElementRender(this.$slots);
  }
});
