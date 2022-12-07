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
 * Type representing that the key will be a string extracted from the first generic type
 * and the value, a record of string having as key one of the different keys
 * in the second generic type and as a value one of the keys in the first generic type.
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
export type TransitionStates<T extends string, E extends string> = {
  [K in T]: Partial<Record<E, T>>;
};

/**
 * Represents a machine state with its states and its initial state.
 *
 * @internal
 */
export type Machine<T extends string, E extends string> = {
  initial: T;
  states: TransitionStates<T, E>;
};
