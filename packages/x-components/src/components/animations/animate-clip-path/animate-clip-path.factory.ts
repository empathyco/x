import './animate-clip-path.style.scss';
import { createDirectionalAnimationFactory } from '../create-directional-animation-factory';

/**
 * Returns a transition component to wrap an element passed in the default slot and animating its
 * clip-path using inset and with the origin passed as parameter.
 *
 * @param animationOrigin - The origin of the animation. This means where the animation starts and
 * ends. For example 'left' makes the element animate from the left and back; 'left-to-right' makes
 * it animate from left to right. If not provided the default value is 'top'.
 * @returns A Transition Component.
 *
 * @public
 */
export const animateClipPath = createDirectionalAnimationFactory('animate-clip-path');
