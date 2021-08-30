import { Result, ResultTagging, Tagging } from '@empathyco/x-types';
import { toKebabCase } from '../utils/string';

/**
 * Creates {@link @empathyco/x-types#Result | results} stub.
 *
 * @param amount - Number of stubbed results to create.
 *
 * @returns Array of results stub.
 *
 * @internal
 */
export function getResultsStub(amount = 3): Result[] {
  return Array.from<number, Result>({ length: amount }, (_, index) =>
    createResultStub(`Product ${index + 1}`)
  );
}

/**
 * Creates a result stub with the provided options. If the name is the only property provided,
 * it will be used to generate the id, name, url and tagging.
 *
 * @param name - The name of the result.
 * @param result - An optional object with fields to override the result.
 *
 * @returns A result.
 */
export function createResultStub(name: string, result?: Partial<Result>): Result {
  const kebabCaseName = toKebabCase(name);
  return {
    id: kebabCaseName,
    modelName: 'Result',
    type: 'Product',
    isWishlisted: false,
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
    url: `/products/${kebabCaseName}`,
    ...result
  };
}

/**
 * Function to create a {@link @empathyco/x-types#ResultTagging | result tagging} mocked object
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
 * Creates a {@link @empathyco/x-types#Tagging | result tagging} mocked object.
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
