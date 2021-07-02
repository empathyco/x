import { Tagging } from '../tagging.model';

/**
 * The result tagging events.
 *
 * @public
 */
export interface ResultTagging {
  /** {@link Tagging | click tagging}. */
  click: Tagging;
  /** {@link Tagging | add to cart tagging}. */
  add2cart: Tagging;
  /** {@link Tagging | checkout tagging}. */
  checkout: Tagging;
  /** Any other {@link Tagging | tagging } key-value. */
  [key: string]: Tagging;
}
