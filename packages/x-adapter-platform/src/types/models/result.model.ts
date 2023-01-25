import { PlatformTagging } from './tagging.model';

/**
 * Result model for the `platform` API.
 *
 * @public
 */
export interface PlatformResult {
  __id: string;
  __externalId: string;
  __name: string;
  __url: string;
  __images: string[];
  __prices: {
    current: {
      value: number;
    };
    previous?: {
      value: number;
    };
    future?: {
      value: number;
    };
  };
  tagging: PlatformTagging;
}
