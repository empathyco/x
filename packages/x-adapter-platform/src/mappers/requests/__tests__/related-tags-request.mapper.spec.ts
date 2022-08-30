import { RelatedTagsRequest } from '@empathyco/x-types';
import { relatedTagsRequestMapper } from '../related-tags-request.mapper';

describe('relatedTagsRequestMapper tests', () => {
  it('should map the request', () => {
    const internalRequest: RelatedTagsRequest = {
      query: 'chips',
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile'
      }
    };

    expect(relatedTagsRequestMapper(internalRequest, {})).toStrictEqual({
      query: 'chips',
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile'
      }
    });
  });
});
