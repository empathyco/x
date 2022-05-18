import { PlatformTagging } from './tagging.model';

/**
 * Result model for the `platform` API.
 *
 * @public
 */
export interface PlatformResult {
  name: string;
  averageRating?: number;
  id: string;
  images?: string[];
  image: string;
  price: number;
  sku?: string;
  url: string;
  tagging: PlatformTagging;
}
