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
export function animationAbstractFactory(
  animationName: string
): (animationOrigin?: AnimationOrigin) => VueConstructor<Vue> {
  return (animationOrigin: AnimationOrigin = 'top'): VueConstructor<Vue> => {
    return Vue.extend({
      data() {
        return { animationOrigin };
      },
      render(h) {
        return h(
          'transition',
          {
            props: { name: `x-${animationName}--${animationOrigin} x-${animationName}-` }
          },
          this.$slots.default
        );
      }
    });
  };
}

export type AnimationOrigin = 'top' | 'bottom' | 'left' | 'right';
