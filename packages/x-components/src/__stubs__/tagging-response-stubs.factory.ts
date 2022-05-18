import { TaggingRequest } from '@empathyco/x-types';

/**
 * Creates a {@link @empathyco/x-types#TaggingRequest | tagging response} stub.
 *
 * @returns Object of tagging response stub.
 *
 * @internal
 */
export function getTaggingResponseStub(): TaggingRequest {
  return {
    params: {
      q: 'lego',
      totalHits: '789',
      lang: 'es',
      follow: false
    },
    url: 'https://api.empathybroker.com/tagging/v1/track/query'
  };
}
