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
