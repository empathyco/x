import Vue, { ComponentOptions } from 'vue';

/**
 * Type options for the property that will be animated.
 */
type AnimatedProperty = 'height' | 'width';

/**
 * Adds parametrized methods to a component to allow the collapsing of the provided property.
 *
 * @param property - The property that will be animated.
 * @returns Mixin for the module.
 * @public
 */
export function createCollapseAnimationMixin(property: AnimatedProperty): ComponentOptions<Vue> {
  const scrollProperty = property === 'width' ? 'scrollWidth' : 'scrollHeight';

  return {
    methods: {
      /**
       * Changes the element's animated property from 0 to the element's content size.
       *
       * @param element - The DOM element that is going to be animated.
       * @internal
       */
      expand(element: HTMLElement): void {
        element.style[property] = '0';
        element.style[property] = `${element[scrollProperty]}px`;
      },
      /**
       * Removes the animated property from the element.
       *
       * @param element - The DOM element that is going to be animated.
       * @internal
       */
      cleanUpAnimationStyles(element: HTMLElement): void {
        element.style.removeProperty(property);
      },
      /**
       * Changes the element's animated property from the element's content size to 0.
       *
       * @param element - The DOM element that is going to be animated.
       * @internal
       */
      collapse(element: HTMLElement): void {
        element.style[property] = `${element[scrollProperty]}px`;
        // This is intended. We want to provoke a layer repaint to apply this style.
        element.getBoundingClientRect();
        element.style[property] = '0';
      }
    }
  };
}
