import { TaggingRequest } from '@empathyco/x-types';
import { taggingRequestMapper } from '../tagging-request.mapper';

describe('taggingRequestMapper tests', () => {
  it('should map the request', () => {
    const internalRequest: TaggingRequest = {
      url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/click',
      params: {
        filtered: 'false',
        follow: false,
        lang: 'en',
        origin: 'search_box:none',
        page: '1',
        position: '1',
        productId: '12345-U',
        q: '12345',
        scope: 'desktop',
        spellcheck: 'false',
        title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree'
      }
    };

    expect(taggingRequestMapper(internalRequest, {})).toStrictEqual({
      filtered: 'false',
      follow: false,
      lang: 'en',
      origin: 'search_box:none',
      page: '1',
      position: '1',
      productId: '12345-U',
      q: '12345',
      scope: 'desktop',
      spellcheck: 'false',
      title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree'
    });
  });
});
