import { RelatedTagsRequest } from '@empathyco/x-types';
import { PlatformRelatedTagsRequest } from '../../../types/requests/related-tags-request.model';
import { relatedTagsRequestMapper } from '../related-tags-request.mapper';

describe('relatedTagsRequestMapper tests', () => {
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

  it('should map the request', () => {
    const request: PlatformRelatedTagsRequest = {
      query: 'chips',
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    };
    expect(relatedTagsRequestMapper(internalRequest, {})).toStrictEqual(request);
  });
});
