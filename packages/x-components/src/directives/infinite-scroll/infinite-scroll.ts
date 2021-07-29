import { DirectiveOptions } from 'vue';
import { Vue } from 'vue/types/vue';
import { InfiniteScroll, ObserverOptions } from './infinite-scroll.types';

const VIEWPORT_ID = 'viewport';

/**
 * A record which contains {@link IntersectionObserver} objects indexed by the id of the scrollable
 * container.
 */
const state: Record<string, IntersectionObserver> = {};

/**
 * Custom Vue directive for infinite scroll.
 *
 * This directive uses the IntersectionObserver API to handle the intersection between the
 * children and the scrollable container. The content of the children moves up on scroll and when it
 * reaches the end the IntersectionObserver triggers that both elements are intersecting.
 *
 * How it works.
 *
 * As a summary, if the scroll reaches the end, the `vNode.context.onInfiniteScrollEnd` function
 * implemented by the component which imports the directive, is executed. If you provide a margin in
 * the directive options, this function is triggered when the scroll reaches the end minus that
 * amount of pixels. A default margin of 200px is set.
 *
 * Usage.
 *
 * The directive has to be set in the target element. It can receive an argument which will be used
 * to determine the scrollable container. Possible values:
 * * html: will set the <html> as the scrollable container.
 * * body: will set the <body> as the scrollable container.
 * * id: will set the DOM element with the provided id as the scrollable container.
 *
 * If no argument is provided the scrollable container fallbacks to the viewport.
 *
 * @example How to use it.
 *
 * ```html
 *  <ResultsList v-infinite-scroll:html>
 * ```
 *
 * ```html
 *  <ResultsList v-infinite-scroll:body>
 * ```
 *
 * ```html
 *  <BaseScroll id='scroll-test'>
 *    <ResultsList v-infinite-scroll:scroll-test>
 *  </BaseScroll>
 * ```
 *
 * ```html
 *  <ResultsList v-infinite-scroll="{ margin: 40 }">
 * ```
 *
 * @public
 */
export const infiniteScroll: DirectiveOptions = {
  inserted(element, { arg: id = VIEWPORT_ID, value: { margin = 200 } = {} }, vNode) {
    const root = getRoot(id);

    state[id] = createIntersectionObserver({
      root,
      margin,
      vNode
    });

    state[id].observe(element);
  },

  unbind(_element, { arg: id = VIEWPORT_ID }) {
    if (state[id]) {
      state[id].disconnect();
      delete state[id];
    }
  }
};

/**
 * Retrieves the root element for the provided id.
 *
 * @param id - String.
 * @returns HTMLElement or null.
 * */
function getRoot(id: string): HTMLElement | null {
  switch (id) {
    case 'html':
      return null;
    case 'body':
      return document.body;
    case VIEWPORT_ID:
      return null;
    default:
      return document.getElementById(id)!;
  }
}

/**
 * Creates an IntersectionObserver.
 *
 * When the observer is fired, it will execute the {@link InfiniteScroll.onInfiniteScrollEnd}
 * function implemented in the provided vNode component instance.
 *
 * @param options - ObserverOptions.
 * @returns IntersectionObserver.
 */
function createIntersectionObserver({
  root,
  margin,
  vNode
}: ObserverOptions): IntersectionObserver {
  // This hack allows the root element to always contain the observed element.
  const rootMargin = `20000000px 0px ${margin}px`;

  return new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        (vNode.componentInstance as Vue & InfiniteScroll)?.onInfiniteScrollEnd();
      }
    },
    {
      threshold: 0.99,
      rootMargin,
      root
    }
  );
}
