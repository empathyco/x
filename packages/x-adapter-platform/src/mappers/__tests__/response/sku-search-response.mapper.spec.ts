import { PlatformSkuSearchResponse } from '../../../types/index';
import { skuSearchResponseMapper } from '../../response/sku-search-response.mapper';
// eslint-disable-next-line max-len
import { platformIdentifierResultsResponse } from '../../../__tests__/__fixtures__/platform-identifier-results.response';
import { skuSearchResponse } from '../../../__tests__/__fixtures__/sku-search.response';

describe('sku search response mapper tests', () => {
  it('should map the sku search response', () => {
    expect(
      skuSearchResponseMapper(
        platformIdentifierResultsResponse as unknown as PlatformSkuSearchResponse,
        {}
      )
    ).toStrictEqual(skuSearchResponse);
  });
});
