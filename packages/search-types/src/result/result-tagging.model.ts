import { Tagging } from '../tagging.model';

export interface ResultTagging {
  click: Tagging;
  add2cart: Tagging;
  checkout: Tagging;
  [key: string]: Tagging;
}
