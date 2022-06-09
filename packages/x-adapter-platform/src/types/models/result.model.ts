import { PlatformTagging } from './tagging.model';

/**
 * Result model for the `platform` API.
 *
 * @public
 */
export interface PlatformResult {
  id: string;
  name: string;
  image: string;
  price: number;
  url: string;
  tagging: PlatformTagging;
}
