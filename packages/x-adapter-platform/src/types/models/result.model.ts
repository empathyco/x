import type { PlatformTagging } from './tagging.model';

/**
 * Result model for the `platform` API.
 *
 * @public
 */
export interface PlatformResult {
  // Unique document id. Not repeated in whole catalog.
  __id: string;
  // Customer id (SKU, MOCACO, etc.) Needed for SKU search.
  __externalId: string;
  // Title of the Result Card.
  __name: string;
  // Link to Product Description Page (PDP).
  __url: string;
  // An Array with all the images links.
  __images: string[];
  __prices: {
    // The current price of the result.
    current: {
      value: number;
    };
    // If there is a discount this is the previous price without discount.
    previous?: {
      value: number;
    };
    // Prewarming price.
    future?: {
      value: number;
    };
  };
  // Tagging links for the current Document.
  tagging: PlatformTagging;
}
