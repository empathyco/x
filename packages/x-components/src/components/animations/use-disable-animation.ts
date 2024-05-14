import { computed, inject } from 'vue';
import { DISABLE_ANIMATIONS_KEY } from '../decorators/injection.consts';

/**
 * Composable to ease disabling animations.
 *
 * @param animationName - The name of the animation.
 * @returns Composable with the computed name of the animation.
 *
 * @public
 */
export function useDisableAnimation(animationName: string) {
  /**
   * Flag to disable the animation.
   */
  const disableAnimation = inject(DISABLE_ANIMATIONS_KEY as string, false);

  /**
   * The animation's name based on the DISABLE_ANIMATIONS_KEY flag.
   *
   * @returns The animation name.
   */
  const name = computed<string>(() => {
    return disableAnimation ? '__no-animation__' : animationName;
  });

  return {
    name
  };
}
