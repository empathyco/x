import { CreateElement, FunctionalComponentOptions, RenderContext, VNode } from 'vue';

/**
 * The purpose of this Component is to use as default value for props that receive a Component that
 * doesn't render any DOM element. For example the animations with `Transition` component.
 *
 * @internal
 */
export const noElementComponent: FunctionalComponentOptions = {
  functional: true,
  /* eslint-disable @typescript-eslint/no-unused-vars-experimental */
  render(h: CreateElement, { children }: RenderContext): VNode {
    return children[0];
  }
};
