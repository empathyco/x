import { Result } from '@empathy/search-types';
import { ResultSchema } from '@empathy/search-types/schemas';
import { deepMerge } from '@empathybroker/deep-merge';
import { Container } from 'inversify';
import { SearchSimpleResponse, SearchSimpleResponseWithNoTagging } from '../../__fixtures__/responses/search.response';
import { EmpathyAdapterBuilder } from '../../builder/empathy-adapter.builder';
import { DEPENDENCIES } from '../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../empathy-adapter.types';
import { pipeMappers } from '../../mappers/pipe-mappers';
import { EmpathyResult } from '../../models';

describe('Empathy Result Mapper', () => {
  const emptyContext: ResponseMapperContext = {
    feature: '',
    url: '',
    requestOptions: {},
    rawRequest: {},
    request: {},
    rawResponse: SearchSimpleResponse
  };
  let container: Container;
  let mapResult: MapFn<EmpathyResult, Result>;
  const spyConsoleWarn = jest.spyOn(console, 'warn');

  beforeEach(() => {
    container = new Container();
    new EmpathyAdapterBuilder(container).build();
    const resultMappers = container.getAll<ResponseMapper<EmpathyResult, Result>>(DEPENDENCIES.ResponseMappers.results);
    mapResult = pipeMappers(...resultMappers);
    jest.resetAllMocks();
  });

  it('maps valid results successfully', () => {
    const mappedResult = mapResult(SearchSimpleResponse.content.docs[0], {} as Result, emptyContext);

    expect(mappedResult).toMatchObject(ResultSchema);
  });

  it('highlights the sku with the query', () => {
    const contextWithQuery = deepMerge(emptyContext, { rawRequest: { query: '456' } });
    const rawResultWithSku = deepMerge({}, SearchSimpleResponse.content.docs[0], { eb_sku: '123456789' });

    const mappedResult = mapResult(rawResultWithSku, {} as Result, contextWithQuery);

    expect(mappedResult).toMatchObject(ResultSchema);
    expect(mappedResult.identifier.html).toEqual(`123<strong class="ebx-result-identifier__query">456</strong>789`);
  });

  it('maps price and discount properties', () => {
    const rawResultWithPrices = deepMerge({},
      SearchSimpleResponse.content.docs[0],
      { originalPrice: 50, price: 50 } as Partial<EmpathyResult>);
    const rawResultWithNullOriginalPrice = deepMerge({},
      SearchSimpleResponse.content.docs[0],
      { price: 50 } as Partial<EmpathyResult>);
    const rawResultWithDiscount = deepMerge({},
      SearchSimpleResponse.content.docs[0],
      { originalPrice: 75, price: 50 } as Partial<EmpathyResult>);
    const rawResultWithInvalidPrice = deepMerge({},
      SearchSimpleResponse.content.docs[0],
      { originalPrice: 30, price: 50 } as Partial<EmpathyResult>);

    const resultWithPrices = mapResult(rawResultWithPrices, {} as Result, emptyContext);
    const resultWithNullOriginalPrice = mapResult(rawResultWithNullOriginalPrice, {} as Result, emptyContext);
    const resultWithDiscount = mapResult(rawResultWithDiscount, {} as Result, emptyContext);
    const resultWithInvalidPrice = mapResult(rawResultWithInvalidPrice, {} as Result, emptyContext);

    expect(resultWithPrices).toMatchObject(ResultSchema);
    expect(resultWithNullOriginalPrice).toMatchObject(ResultSchema);
    expect(resultWithDiscount).toMatchObject(ResultSchema);
    expect(resultWithPrices.price).toEqual({ value: 50, originalValue: 50, hasDiscount: false });
    expect(resultWithNullOriginalPrice.price).toEqual({ value: 50, originalValue: 50, hasDiscount: false });
    expect(resultWithDiscount.price).toEqual({ value: 50, originalValue: 75, hasDiscount: true });
    expect(resultWithInvalidPrice.price).toEqual({ value: 50, originalValue: 30, hasDiscount: false });
  });

  it('maps rating property', () => {
    const rawResultWithRating = deepMerge({},
      SearchSimpleResponse.content.docs[0],
      { rating: '0' } as Partial<EmpathyResult>);
    const rawResultWithoutRating = deepMerge({},
      SearchSimpleResponse.content.docs[0],
      {} as Partial<EmpathyResult>);

    const resultWithRating = mapResult(rawResultWithRating, {} as Result, emptyContext);
    const resultWithoutRating = mapResult(rawResultWithoutRating, {} as Result, emptyContext);

    expect(resultWithRating).toMatchObject(ResultSchema);
    expect(resultWithoutRating).toMatchObject(ResultSchema);
    expect(resultWithRating.rating.value).toEqual(0);
    expect(resultWithoutRating.rating.value).toEqual(null);
  });

  it('maps checkout tagging successfully', () => {
    const mappedResult = mapResult(SearchSimpleResponse.content.docs[0], {} as Result, emptyContext);

    expect(mappedResult).toMatchObject(ResultSchema);
    expect(mappedResult).toHaveProperty(['tagging', 'checkout']);
  });

  it('maps isWishlist to every result', () => {
    const results = SearchSimpleResponse.content.docs;
    results.forEach(result => {
      const mappedResult = mapResult(result, {} as Result, emptyContext);
      expect(mappedResult).toHaveProperty('isWishlisted');
    });
  });

  it('maps isWishlisted to the existing rawResult.isWishlisted value if property exists', () => {
    const mappedResult = mapResult(SearchSimpleResponse.content.docs[0], {} as Result, emptyContext);

    expect(mappedResult).toMatchObject(ResultSchema);
    expect(mappedResult).toHaveProperty('isWishlisted', true);
  });

  it('should not show tagging warnings when NODE_ENV is ‘staging´', () => {
    process.env.NODE_ENV = 'staging';
    mapResult(SearchSimpleResponseWithNoTagging.content.docs[0], {} as Result, emptyContext);
    expect(spyConsoleWarn).toBeCalled();
  });

  it('should not show tagging warnings when NODE_ENV is ‘production´', () => {
    process.env.NODE_ENV = 'production';
    mapResult(SearchSimpleResponseWithNoTagging.content.docs[0], {} as Result, emptyContext);
    expect(spyConsoleWarn).not.toBeCalled();
  });
});
