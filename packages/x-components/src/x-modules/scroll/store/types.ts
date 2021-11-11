import { ScrollDirection } from '../../../components/scroll/scroll.types';
import { XStoreModule } from '../../../store';
import { Dictionary } from '../../../utils/types';

/**
 * Scroll store state.
 *
 * @public
 */
export interface ScrollState {
  /**
   * State data of the scroll components.
   */
  data: Dictionary<ScrollComponentState>;
  /**
   * The `[data-scroll]` value of the pending to restore scroll.
   */
  pendingScrollTo: string;
}

/**
 * Contains all the state of a scroll component.
 *
 * @public
 */
export interface ScrollComponentState {
  /**
   * The position in pixels the user has scrolled down.
   */
  position: number;
  /**
   * The direction the user is scrolling.
   */
  direction: ScrollDirection;
  /**
   * True if the user has already reached the end of the scroll panel.
   */
  hasReachedEnd: boolean;
  /**
   * True if the scroll position is 0.
   */
  hasReachedStart: boolean;
}

/**
 * Scroll store getters.
 *
 * @public
 */
export interface ScrollGetters {}

/**
 * Scroll store mutations.
 *
 * @public
 */
export interface ScrollMutations {
  setPendingScrollTo(pendingScrollTo: string): void;
  setScrollPosition(position: ScrollPositionPayload): void;
  setScrollDirection(direction: ScrollDirectionPayload): void;
  setScrollHasReachedStart(hasReachedStart: ScrollPositionReachedPayload): void;
  setScrollHasReachedEnd(hasReachedEnd: ScrollPositionReachedPayload): void;
}

/**
 * Payload object containing the identifier of the scroll and its position.
 *
 * @public
 */
export interface ScrollPositionPayload {
  /**
   * The amount of pixels scrolled.
   */
  position: number;
  /**
   * The identifier of the scroll element.
   */
  id: string;
}

/**
 * Payload object containing the identifier of the scroll and its direction.
 *
 * @public
 */
export interface ScrollDirectionPayload {
  /**
   * The current direction of the scroll.
   */
  direction: ScrollDirection;
  /**
   * The identifier of the scroll element.
   */
  id: string;
}

/**
 * Payload object containing the identifier of the scroll and a boolean indicating if
 * it has reached certain position.
 *
 * @public
 */
export interface ScrollPositionReachedPayload {
  /**
   * True if it has reached certain position. False otherwise.
   */
  value: boolean;
  /**
   * The identifier of the scroll element.
   */
  id: string;
}

/**
 * Scroll store actions.
 *
 * @public
 */
export interface ScrollActions {}

/**
 * Scroll type safe store module.
 *
 * @public
 */
export type ScrollXStoreModule = XStoreModule<
  ScrollState,
  ScrollGetters,
  ScrollMutations,
  ScrollActions
>;
