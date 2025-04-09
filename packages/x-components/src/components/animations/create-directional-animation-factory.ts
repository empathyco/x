import type { DefineComponent } from 'vue'
import { defineComponent, h, Transition } from 'vue'

export type AnimationOrigin =
  | 'top'
  | 'bottom'
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'left'
  | 'right'
  | 'left-to-right'
  | 'right-to-left'

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
  animationName: string,
): (animationOrigin?: AnimationOrigin) => DefineComponent {
  return (animationOrigin = 'top') =>
    defineComponent({
      name: `transition-${animationName}-${animationOrigin}`,
      setup(_, { slots }) {
        return () =>
          h(
            Transition,
            {
              name: `x-${animationName}--${animationOrigin} x-${animationName}-`,
            },
            // Vue recommends using function for better performance.
            () => slots.default?.() ?? '',
          )
      },
    })
}
