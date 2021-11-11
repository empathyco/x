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
  /**
   * Sets the identifier of the element that is pending to be scrolled into the view.
   *
   * @param pendingScrollTo - The identifier of the element that should be scrolled into view
   * whenever it is loaded.
   */
  setPendingScrollTo(pendingScrollTo: string): void;
  /**
   * Sets the scroll position of a certain panel.
   *
   * @param position - The new scroll position and the identifier of the panel it belongs.
   */
  setScrollPosition(position: ScrollPositionPayload): void;
  /**
   * Sets the scroll direction of a certain panel.
   *
   * @param direction - The new scroll direction and the identifier of the panel it belongs.
   */
  setScrollDirection(direction: ScrollDirectionPayload): void;
  /**
   * Sets if the scroll has reached the start position of a panel.
   *
   * @param hasReachedStart - An object containing if the scroll position is at the start and
   * the identifier of this panel.
   */
  setScrollHasReachedStart(hasReachedStart: ScrollPositionReachedPayload): void;
  /**
   * Sets if the scroll has reached the end position of a panel.
   *
   * @param hasReachedEnd - An object containing if the scroll position is at the end and
   * the identifier of this panel.
   */
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
