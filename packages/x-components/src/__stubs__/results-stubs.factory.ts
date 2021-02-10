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
      identifier: {
        value: 'A022/3234'
      },
      name: 'Product 001',
      images: ['https://picsum.photos/seed/1/200/300', 'https://picsum.photos/seed/2/200/300'],
      url: 'http://x-components.com/xc-001.html',
      tagging: getResultTagging('xr-001'),
      price: {
        hasDiscount: false,
        value: 30,
        originalValue: 30
      },
      ...getResultCommonValues()
    },
    {
      id: 'xc-002',
      identifier: {
        value: '1234567890'
      },
      name: 'Product 002',
      images: ['xc-002-01.jpg', 'xc-002-02.jpg'],
      url: 'http://x-components.com/xc-0002.html',
      tagging: getResultTagging('xr-002'),
      price: {
        hasDiscount: true,
        value: 20,
        originalValue: 30
      },
      ...getResultCommonValues()
    },
    {
      id: 'xc-003',
      identifier: {
        value: 'A022/6534'
      },
      name: 'Product 003',
      images: [
        'https://notexistsimage1.com',
        'https://notexistsimage2.com',
        'https://notexistsimage3.com',
        'https://picsum.photos/seed/3/200/300'
      ],
      url: 'http://x-components.com/xc-003.html',
      tagging: getResultTagging('xr-003'),
      price: {
        hasDiscount: false,
        value: 30,
        originalValue: 30
      },
      ...getResultCommonValues()
    },
    {
      id: 'xc-004',
      identifier: {
        value: 'A033/6534'
      },
      name: 'Product 004',
      images: [
        'https://notexistsimage1.com',
        'https://notexistsimage2.com',
        'https://notexistsimage3.com',
        'https://picsum.photos/seed/3/200/300'
      ],
      url: 'http://x-components.com/xc-004.html',
      tagging: getResultTagging('xr-004'),
      price: {
        hasDiscount: true,
        value: 30.99,
        originalValue: 75.95
      },
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
    rating: {}
  };
}

/**
 * Creates a result stub with the provided options. If the name is the only property provided,
 * it will be used to generate the id, name, url and tagging.
 *
 * @param name - The name of the result.
 * @param result - An optional object with fields to override the result.
 * @returns A result.
 */
export function createResultStub(name: string, result?: Partial<Result>): Result {
  const kebabCaseName = name.toLowerCase().replace(/\s/g, '-');
  return {
    id: kebabCaseName,
    modelName: 'Result',
    type: 'Product',
    isWishlisted: false,
    callbackInfo: {},
    identifier: {
      value: kebabCaseName
    },
    images: [],
    name,
    price: {
      hasDiscount: false,
      originalValue: 10,
      value: 10
    },
    rating: {
      value: 5
    },
    tagging: getResultTagging(kebabCaseName),
    url: `/products/${name}`,
    ...result
  };
}
