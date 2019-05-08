import { Tagging } from '../tagging.model';

export interface ResultTagging {
  click: Tagging;
  add2cart: Tagging;
  conversion?: Tagging;
  wishlist?: Tagging;
  query: Tagging;
  [key: string]: Tagging | undefined;
}
