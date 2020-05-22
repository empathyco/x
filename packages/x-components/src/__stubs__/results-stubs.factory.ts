import { Result, ResultTagging, Tagging } from '@empathy/search-types';
import { DeepPartial } from '../utils/types';

/**
 * Creates {@link @empathy/search-types#Result | results} stub.
 *
 * @returns Array of results stub.
 *
 * @internal
 */
export function getResultsStub(): Result[] {
  return [
    {
      id: 'xc-001',
      name: 'Product 001',
      images: ['xc-001-01.jpg', 'xc-001-02.jpg'],
      url: 'http://x-components.com/xc-001.html',
      tagging: getResultTagging('xr-001'),
      ...getResultCommonValues()
    },
    {
      id: 'xc-002',
      name: 'Product 002',
      images: ['xc-002-01.jpg', 'xc-002-02.jpg'],
      url: 'http://x-components.com/xc-0002.html',
      tagging: getResultTagging('xr-002'),
      ...getResultCommonValues()
    }
  ] as Result[];
}

/**
 * Function to create a {@link @empathy/search-types#ResultTagging | result tagging} mocked object
 * based on result id.
 *
 * @param productId - Product id to build mocked params.
 *
 * @returns ResultTagging mocked object.
 *
 * @internal
 */
function getResultTagging(productId: string): ResultTagging {
  return {
    click: getTaggingByAction('click', { productId }),
    add2cart: getTaggingByAction('add2cart', { productId }),
    checkout: getTaggingByAction('checkout', { productId })
  };
}

/**
 * Creates a {@link @empathy/search-types#Tagging | result tagging} mocked object.
 *
 * @param action - String with the action to tag.
 * @param params - Params to add to the tagging request.
 *
 * @returns Tagging mocked object.
 *
 * @internal
 */
function getTaggingByAction(action: string, params: Record<string, any>): Tagging {
  return {
    url: `http://x-components.com/tagging/${action}`,
    params: {
      lang: 'es',
      ...params
    }
  };
}

/**
 * Creates a deep partial result with common values for all result stub array.
 *
 * @returns DeepPartial result.
 *
 * @internal
 */
function getResultCommonValues(): DeepPartial<Result> {
  return {
    modelName: 'Result',
    type: 'Product',
    isWishlisted: false,
    rating: {},
    price: {},
    identifier: {}
  };
}
