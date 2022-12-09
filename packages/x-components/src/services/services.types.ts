import { ArrowKey } from '../utils/types';

/**
 * Interface for SpatialNavigation services based on
 * {@link https://www.w3.org/TR/css-nav-1/ | CSSWK specification}.
 *
 * @public
 */
export interface SpatialNavigation {
  /**
   * Get next element to navigate to.
   *
   * @param arrowKey - The arrow key that was pressed.
   *
   * @returns The element to navigate to or null.
   */
  navigateTo(direction: ArrowKey): HTMLElement;
}

/**
 * Interface representing the coordinates of a point.
 *
 * @internal
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Type representing two points for comparision purposes.
 *
 * @internal
 */
export type Points = [Point, Point];

/**
 * Interface representing the projected intersection values between two elements.
 *
 * @internal
 */
export interface Intersection {
  width: number;
  height: number;
  area: number;
}

/**
 * Interface representing the absolute distances between two element's points in both axis.
 *
 * @internal
 */
export interface AbsoluteDistances {
  x: number;
  y: number;
}

/**
 * Type for the different status of a machine, and how to transition between them.
 * The `SomeStatus` parameter is a union containing all the possible status the
 * machine can be in, and the `SomeEvent` parameter is a union containing all the
 * possible events that can be emitted to change from one status to another one.
 *
 * @example
 * ```typescript
 * type Status = 'initial' | 'transitioned' | 'idle';
 * type Events = 'Event1' | 'Event2'
 *
 * const transition: TransitionStates<Status, Events> = {
 *   initial: {
 *     Event1: 'transitioned',
       Event2: 'idle'
 *   },
 *   transitioned: {
 *     Event2: 'initial'
 *   },
 *   idle: {
 *     Event1: 'initial'
 *   }
 * }
 * ```
 *
 *
 * @internal
 */
export type TransitionStates<SomeStatus extends string, SomeEvent extends string> = {
  [Key in SomeStatus]: Partial<Record<SomeEvent, SomeStatus>>;
};

/**
 * Represents a machine state with its states and its initial state.
 *
 * @internal
 */
export type Machine<SomeStatus extends string, SomeEvent extends string> = {
  initial: SomeStatus;
  states: TransitionStates<SomeStatus, SomeEvent>;
};
