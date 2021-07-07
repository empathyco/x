import Vue, { CreateElement, VNode } from 'vue';

/**
 * The purpose of this Component is to use as default value for props that receive a Component that
 * doesn't render any DOM element. For example the animations with `Transition` component.
 *
 * @internal
 */
export const NoElement = Vue.extend({
  render(h: CreateElement): VNode {
    return this.$slots.default?.[0] ?? h();
  }
});
