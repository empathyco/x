import { Tagging } from '../tagging.model';

/**
 * @public
 * The result tagging events
 */
export interface ResultTagging {
  click: Tagging;
  add2cart: Tagging;
  checkout: Tagging;
  [key: string]: Tagging;
}
