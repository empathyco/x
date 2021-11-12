import { ScrollDirection } from '../../components/scroll/scroll.types';

/**
 * Dictionary of the events of Scroll XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface ScrollXEvents {
  /**
   * The scroll position has been restored successfully.
   * * Payload: none.
   */
  ScrollRestoreSucceeded: void;
  /**
   * The scroll position has failed to be restored.
   * * Payload: none.
   */
  ScrollRestoreFailed: void;
  /**
   * The user has almost reached the scroll end.
   * * Payload: True if the user has almost reached the scroll end, false if it is no longer close
   * to the end.
   */
  UserAlmostReachedScrollEnd: boolean;
  /**
   * The user has changed the direction of scroll.
   * * Payload: The new {@link ScrollDirection} when user changes scroll direction.
   */
  UserChangedScrollDirection: ScrollDirection;
  /**
   * The user has reached the scroll end.
   * * Payload: True if the user has reached the ending position of the scroll. False if he is
   * no longer in that position.
   */
  UserReachedScrollEnd: boolean;
  /**
   * The user has reached the scroll start.
   * * Payload: True if the user has reached the starting position of the scroll. False if he is no
   * longer in that position.
   */
  UserReachedScrollStart: boolean;
  /**
   * The user has scrolled.
   * * Payload: The new position of scroll.
   */
  UserScrolled: number;
  /**
   * The user has scrolled to an element with the given id.
   * * Payload: The scroll identifier of the element.
   */
  UserScrolledToElement: string;
}
