import { Tagging } from '../tagging.model';

export interface ResultTagging {
  click: Tagging;
  add2cart: Tagging;
  [key: string]: Tagging;
}
