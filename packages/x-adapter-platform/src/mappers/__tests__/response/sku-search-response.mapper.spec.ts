import { skuSearchResponseMapper } from '../../responses/sku-search-response.mapper';
// eslint-disable-next-line max-len
import { platformSkuSearchResponse } from '../../../__tests__/__fixtures__/platform-sku-search.response';
import { skuSearchResponse } from '../../../__tests__/__fixtures__/sku-search.response';
import { PlatformSkuSearchResponse } from '../../../types/response.types';

describe('sku search response mapper tests', () => {
  it('should map the sku search response', () => {
    expect(
      skuSearchResponseMapper(platformSkuSearchResponse as unknown as PlatformSkuSearchResponse, {})
    ).toStrictEqual(skuSearchResponse);
  });
});
