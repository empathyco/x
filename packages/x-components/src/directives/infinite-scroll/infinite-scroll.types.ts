import { VNode } from 'vue';

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

/**
 * Options used by the IntersectionObserver.
 *
 * @internal
 */
export interface ObserverOptions {
  /** The parent container used by the IntersectionObserver. If null, viewport will be observed. */
  root: HTMLElement | null;
  /** Amount of pixels that is used in the computed margin passed to the IntersectionObserver. */
  margin: number;
  /** VNode which contents the `onInfiniteScrollEnd` method within the context. */
  vNode: VNode;
}
