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
   * * Payload: The distance missing to end position position.
   */
  UserAlmostReachedScrollEnd: number;
  /**
   * The user has changed the direction of scroll.
   * * Payload: The new {@link ScrollDirection} when user changes scroll direction.
   */
  UserChangedScrollDirection: ScrollDirection;
  /**
   * The user has reached the scroll end.
   * * Payload: none.
   */
  UserReachedScrollEnd: void;
  /**
   * The user has reached the scroll start.
   * * Payload: none.
   */
  UserReachedScrollStart: void;
  /**
   * The user has scrolled.
   * * Payload: The new position of scroll.
   */
  UserScrolled: number;
}
