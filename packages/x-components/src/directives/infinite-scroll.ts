import { DirectiveOptions, VNode } from 'vue';
import { Vue } from 'vue/types/vue';
import { debounce } from '../utils/debounce';

const VIEWPORT_ID = 'viewport';

/**
 * Interface to be implemented by the component which uses the infinite scroll directive.
 * If the component wants to trigger an action when the scroll is about to end it needs to implement
 * the `onInfiniteScrollEnd` method.
 *
 * @public
 */
export interface InfiniteScroll {
  onInfiniteScrollEnd: () => void;
}

/** Interface used in {@link state | state map}. */
interface InfiniteScrollState {
  /** The {@link ResizeObserver} instance reports changes to the dimensions of the
   element that has been subscribed as observer. */
  resizeObserver: ResizeObserver;
  /** The {@link IntersectionObserver} instance reports changes in the
   intersection of a target element. */
  intersectionObserver: IntersectionObserver;
  /** A list of {@link HTMLElement} that observers the {@link IntersectionObserver}. */
  observedElements: HTMLElement[];
}

/**
 * It keeps directive state as part of the exported module. It's a map which contains
 * {@link InfiniteScrollState | InfiniteScrollState} objects indexed by the id of the scrollable
 * parent.
 */
const state = new Map<string, InfiniteScrollState>();

interface IntersectionObserverFactoryOptions {
  /** Amount of pixels that is used in the computed margin passed to the IntersectionObserver. */
  margin: number;
  /** HTML element to be passed as root to the IntersectionObserver. */
  root: HTMLElement | null;
  /** VNode which contents the `onInfiniteScrollEnd` method within the context. */
  vNode: VNode;
  /** A list of {@link HTMLElement} that observers the {@link IntersectionObserver}. */
  observedElements: HTMLElement[];
}

/**
 * It returns a function that creates {@link IntersectionObserver} instances init with the values
 * passed as parameters:
 *
 * - It calls `onInfiniteScrollEnd` function of the vNode context if the conditions are met. The
 * interface {@link InfiniteScroll} has to be implemented by the component
 * that uses the directive.
 * - The detection area is placed above using the margin. Callback conditions are
 * fulfilled when the target is not intersecting and the scroll direction is downwards. The top
 * limit is moved to the bottom subtracting its height (remember that if the root is null, viewport
 * is the reference so in that case the height is the viewport's height) and the margin; the bottom
 * limit is moved the amount of pixels provided in the margin property downwards.
 *
 * It also iterates over the observed elements list and it makes each of them observe the created
 * instance.
 *
 * @remarks It's necessary to debounce the intersection observer callback. If not, in an scenario in
 * which the scroll moves to top with an smooth behaviour, the function is triggered before the
 * scroll reaches the top.
 *
 * @returns {@link IntersectionObserver}.
 */
function intersectionObserverFactory({
  margin,
  root,
  vNode,
  observedElements
}: IntersectionObserverFactoryOptions): () => IntersectionObserver {
  return () => {
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < entry.rootBounds!.top) {
          (vNode.componentInstance as Vue & InfiniteScroll)?.onInfiniteScrollEnd();
        }
      },
      {
        // An extra pixel is needed in order to overtake the own element bottom limit.
        rootMargin: `
          -${(root ? root.offsetHeight : window.innerHeight) + margin + 1}px
          0px
          ${margin + 1}px
          0px
        `,
        root
      }
    );

    observedElements.forEach(element => {
      intersectionObserver.observe(element);
    });

    return intersectionObserver;
  };
}

/**
 * It returns a {@link ResizeObserver} instance at which root element observe.
 *
 * If the root element size changes, the intersection observer is replaced with a new one calling
 * {@link createIntersectionObserver} function which contains the updated size values. The old
 * intersection observer triggers disconnect, and it iterates over the elements observing it to
 * observe the new instance.
 *
 * The callback function is debounced.
 *
 * @param resizeCallback - Callback function passed debounced to the {@link ResizeObserver}.
 *
 * @returns A {@link ResizeObserver} with the `resizeCallback` function debounced
 * as callback.
 */
function createDebouncedResizeObserver(resizeCallback: () => void): ResizeObserver {
  return new ResizeObserver(debounce(resizeCallback, 300));
}

/**
 * It returns an {@link HTMLElement} object from the DOM whose id property matches the id passed as
 * param. It returns null if no id is passed as parameter.
 *
 * @remarks If an id is passed and the element is not found, it throws an error in order to abort
 * the directive execution.
 *
 * @param id - Element target id to be used with {@link getElementById}.
 *
 * @returns A {@link HTMLElement} if id is provided; null otherwise.
 */
function getElementById(id?: string): HTMLElement | null {
  const element = id ? document.getElementById(id) : null;

  if (id && !element) {
    throw new Error('infinite-scroll: element with provided id not found');
  }

  return element;
}

/**
 * It returns the {@link state} map key to be used. If no id is provided, it returns
 * {@link VIEWPORT_ID} which is the key used to store viewport's {@link state} value when the id
 * is null.
 *
 * @remarks {@link VIEWPORT_ID} is considered as reserved word so it throws an error if it's used
 * as id.
 *
 * @param id - Target id to be used as key in the {@link state} map.
 *
 * @returns Key to be used in the {@link state} map.
 */
function getStateMapKey(id?: string): string {
  if (id === VIEWPORT_ID) {
    throw new Error('infinite-scroll: invalid id passed as argument');
  }

  return id ?? VIEWPORT_ID;
}

/**
 * Custom Vue directive that is intended to be used for infinite scroll by which the children
 * react to the scroll of a parent component.
 *
 * Intersection observer and intersection area.
 *
 * This directive uses the IntersectionObserver API to handle the intersection between the
 * children and the scroll of the parent (root) component. The intersection area is "moved" above
 * the root element itself with the IntersectionObserver margin property. The content of
 * the children moves up on scroll and when the scroll reaches the end (considering margin 0),
 * the intersection observer triggers that root and children elements are not intersecting.
 *
 * How it works.
 *
 * As a summary, if the scroll reaches the end, the `vNode.context.onInfiniteScrollEnd` function
 * implemented by the component which imports the directive, is executed. If you pass margin in the
 * directive options, that function is triggered when the scroll reaches the end minus that
 * amount (of pixels).
 *
 * Usage.
 *
 * The directive has to be set in the target element.
 *
 * You can pass an argument to the directive which is the HTMLElement id of the scrollable
 * parent. Or you can leave the argument empty and it takes the viewport, HTMLDocument, as
 * the scrollable parent.
 *
 * You can also pass as directive value an object with the margin to specify how many pixels before
 * the scroll end you want to trigger the function.
 *
 * @example Intersection area explanation without margin.
 *
 * See what happens when we don't set margin (0 by default). One row means 1R; this element has 3R
 * height. The computed margin would be `-3R 0 0 0`, so the top limit is moved above.
 *
 *  0R   _ _ _
 *  1R  |     | -\> Default detection area, border box (not content box) of the root element.
 *  2R  |     |
 *  3R  |_ _ _|
 *
 *  0R   _ _ _
 *  1R  |     |
 *  2R  |     |
 *  3R  |=====| -\> Resultant detection area which starts and ends at 3R, like a line.
 *
 *
 * @example Intersection area explanation with margin.
 *
 * See what happens when we set margin, e.g. 2R. One row means 1R; this element has 3R
 * height. The computed margin would be `-5R 0 -2R 0`, so the top limit is moved above.
 *
 *  0R   _ _ _
 *  1R  |     | -\> Default detection area, border box (not content box) of the root element.
 *  2R  |     |
 *  3R  |_ _ _|
 *
 *  0R   _ _ _
 *  1R  |     | -\> Default detection area, border box (not content box) of the root element.
 *  2R  |     |
 *  3R  |_ _ _|
 *  4R
 *  5R  ======  -\> Resultant detection area which top has been moved from 0R to 5R (-3R - 2R); and
 *                  bottom limit has been moved from 3R to 5R (-2R).
 *
 * @example How to use it.
 *
 * ```html
 *  <BaseScroll id='scroll-test'>
 *    <ResultsList v-infinite-scroll:scroll-test>
 *  </BaseScroll>
 *  <BaseScroll id='scroll-test-2'>
 *    <ResultsList v-infinite-scroll:scroll-test-2>
 *  </BaseScroll>
 *  <ResultsList v-infinite-scroll>
 * ```
 *
 * ```js
 *  console.log(state);
 *  Map(2) {"scroll-test" => {...}, "scroll-test-2" => {...}, "viewport" => {...}}
 *    0: {"scroll-test" => Object}
 *      key: "scroll-test"
 *      value:
 *        intersectionObserver: IntersectionObserver {...},
 *        observedElements: [ element1, element2, ...]
 *        resizeObserver: ResizeObserver {...}
 *    1: {"scroll-test-2" => Object}
 *      key: "scroll-test-2"
 *      value:
 *        ...
 *    2: {"viewport" => Object}
 *      key: "viewport"
 *      value:
 *        ...
 * ```
 *
 * @public
 */
export const infiniteScroll = ((): DirectiveOptions => {
  return {
    /**
     * Directive inserted hook.
     *
     * The key is the id or if none is provided {@link VIEWPORT_ID}. That viewport id is a reserved
     * id and an error is thrown if you use it.
     *
     * The root element is the result of {@link getElementById} using the id. If no id is provided
     * `null` root is set as null. If the root element is null, the intersection observer API
     * sets the viewport, {@link HTMLDocument}, as root.
     *
     * The margin is got from binding value.
     *
     * If the state doesn't have an entry stored with that key, it creates and stores a new one.
     *
     * The {@link intersectionObserverFactory} returns a function stored as
     * `createIntersectionObserver`to create an {@link IntersectionObserver} instances with the same
     * parameters which are `root`, `margin`,`vNode` and `observedElements` array. That function
     * also iterates over the elements and make them to observe the new instance.
     *
     * Then {@link createDebouncedResizeObserver} returns a {@link ResizeObserver} instance whose
     * callback is a debounced version of the callback passed as argument. This observer is
     * responsible to disconnect the intersection observer (make all the elements that are observing
     * it, unobserve); and it also calls the same `createIntersectionObserver` we got from the
     * factory, in order to create a new intersection observer instance and make the elements to
     * observe it. Notice that we directly reassign `intersectionObserver` that is stored in the
     * state under the same key.
     *
     * After that, we set the root to observe the resize observer instance created. If the root is
     * `null` (remember, this means it's the viewport), we need to specify the `documentElement` as
     * element. Just the {@link IntersectionObserver} API interprets `null` as the viewport.
     *
     * In the other hand, if the key already exists in the state, the target element observes it and
     * itself is added to the elements array stored.
     *
     * @param element - Directive target HTML element.
     * @param binding - Directive binding options.
     * @param vNode - Directive target vNode.
     */
    inserted: async function (element, binding, vNode) {
      await vNode?.componentInstance?.$nextTick();
      const id = binding.arg;
      const key = getStateMapKey(id);
      const root = getElementById(id);
      const margin = binding.value?.margin ?? 0;

      if (!state.has(key)) {
        const observedElements = [element];

        const createIntersectionObserver = intersectionObserverFactory({
          root,
          margin,
          vNode,
          observedElements
        });

        // Init intersection observer.
        let intersectionObserver = createIntersectionObserver();

        // Init resize observer.
        const resizeObserver = createDebouncedResizeObserver(() => {
          intersectionObserver.disconnect();
          intersectionObserver = createIntersectionObserver();
        });

        /* It doesn't accept `null` as the IntersectionObserver does, so we have to pass
          `document.documentElement` explicitly.*/
        resizeObserver.observe(root ?? document.documentElement);

        // Saving it in the directive state.
        state.set(key, {
          resizeObserver,
          intersectionObserver,
          observedElements
        });
      } else {
        const { intersectionObserver, observedElements } = state.get(key)!;

        if (intersectionObserver) {
          intersectionObserver.observe(element);
          observedElements.push(element);
        }
      }
    },
    /**
     * First, it looks for the whole value within {@link state} using the id passed as
     * directive parameter.
     *
     * Then, it looks for itself as {@link HTMLElement} in the observed elements array. If it's
     * found, it stop to observe the intersection observer and removes itself from the elements
     * array.
     *
     * Resize observer and intersection observers are disconnected if there are no elements
     * observing left in the array. It also removes itself from the state.
     *
     * @param element - Directive target HTML element.
     * @param binding - Directive binding options.
     */
    unbind(element, binding) {
      const id = binding.arg;
      const key = getStateMapKey(id);

      if (!state.has(key)) {
        return;
      }

      const { intersectionObserver, observedElements, resizeObserver } = state.get(key)!;

      const observerIndex = observedElements.indexOf(element);

      if (observerIndex > -1) {
        intersectionObserver.unobserve(observedElements[observerIndex]);
        observedElements.splice(observerIndex, 1);
      }

      if (!observedElements.length) {
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        state.delete(key);
      }
    }
  };
})();
