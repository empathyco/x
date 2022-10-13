import Vue, { VueConstructor } from 'vue';

/**
 * Abstract Factory to create animations Factory. The returned animation factory uses the
 * `animationName` parameter to create a Transition Component with that name.
 *
 * @param animationName - The name to use in the Transition Component of animation.
 * @returns The animation factory configured.
 *
 * @internal
 */
export function createDirectionalAnimationFactory(
  animationName: string
): (animationOrigin?: AnimationOrigin) => VueConstructor {
  return (animationOrigin = 'top') => {
    return Vue.extend({
      name: `transition-${animationName}-${animationOrigin}`,
      inheritAttrs: false,
      render(h) {
        return h(
          'transition',
          {
            props: {
              name: `x-${animationName}--${animationOrigin} x-${animationName}-`,
              ...this.$attrs
            },
            on: this.$listeners
          },
          this.$slots.default
        );
      }
    });
  };
}

export type AnimationOrigin =
  | 'top'
  | 'bottom'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'left'
  | 'right'
  | 'left-to-right'
  | 'right-to-left';
