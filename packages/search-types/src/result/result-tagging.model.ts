import { Tagging } from '../tagging.model';

export interface ResultTagging {
  click: Tagging;
  add2cart: Tagging;
  query: Tagging | null;
  [key: string]: Tagging | null;
}
