import { TaggingInfo } from '@empathyco/x-types';

/**
 * Creates a {@link @empathyco/x-adapter#TaggingInfo | tagging response} stub.
 *
 * @returns Object of tagging response stub.
 *
 * @internal
 */
export function getTaggingResponseStub(): TaggingInfo {
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
