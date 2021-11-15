import { Identifiable } from '@empathyco/x-types';
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
   * True if the user has almost reached the end of the scroll panel.
   */
  hasAlmostReachedEnd: boolean;
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
   * @param partialState - An object with the fields to modify.
   */
  setScrollComponentState(partialState: ScrollStatePayload): void;
}

/**
 * Payload object containing the identifier of the scroll and its position.
 *
 * @public
 */
export interface ScrollStatePayload extends Identifiable<string> {
  /**
   * A partial {@link ScrollComponentState} update to perform to the targeted panel.
   */
  newState: Partial<ScrollComponentState>;
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
