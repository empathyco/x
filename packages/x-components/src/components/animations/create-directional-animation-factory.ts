import { defineComponent, h } from 'vue';

export type AnimationOrigin =
  | 'top'
  | 'bottom'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'left'
  | 'right'
  | 'left-to-right'
  | 'right-to-left';

/**
 * Abstract Factory to create animations Factory. The returned animation factory uses the
 * `animationName` parameter to create a Transition Component with that name.
 *
 * @param animationName - The name to use in the Transition Component of animation.
 * @returns The animation factory configured.
 *
 * @internal
 */
export function createDirectionalAnimationFactory(animationName: string) {
  return (animationOrigin: AnimationOrigin = 'top') =>
    defineComponent({
      name: `transition-${animationName}-${animationOrigin}`,
      inheritAttrs: false,
      setup(_, { attrs, listeners, slots }) {
        return () =>
          h(
            'transition',
            {
              props: {
                name: `x-${animationName}--${animationOrigin} x-${animationName}-`,
                ...attrs
              },
              on: listeners
            },
            slots.default?.() ?? []
          );
      }
    });
}
