import './animate-translate.style.scss';
import { createDirectionalAnimationFactory } from '../create-directional-animation-factory';

/**
 * Returns a transition component to wrap an element passed in the default slot and animating its
 * translate using transform and with the transform origin passed as parameter.
 *
 * @param animationOrigin - The origin of the transform animation. This means where the animation
 * starts and ends. For example 'left' makes the element animate from the left and back;
 * 'left-to-right' makes it animate from left to right. If not provided the default value is 'top'.
 * @returns A Transition Component.
 *
 * @public
 */
export const animateTranslate = createDirectionalAnimationFactory('animate-translate');
