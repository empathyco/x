import { PlatformRelatedTagsResponse } from '../../../types/responses/related-tags-response.model';
import { relatedTagsResponseMapper } from '../related-tags-response.mapper';

describe('relatedTagsResponseMapper tests', () => {
  it('should map the response', () => {
    const platformRelatedTagsResponse: PlatformRelatedTagsResponse = {
      data: {
        relatedtags: [
          {
            query: 'levis jeans',
            source: 'ORGANIC',
            tag: 'levis',
            position: 1000
          },
          {
            query: 'shoes brown',
            position: 1000,
            source: 'CURATED',
            tag: 'shoes'
          }
        ]
      },
      status: 200
    };

    expect(relatedTagsResponseMapper(platformRelatedTagsResponse, {})).toStrictEqual({
      relatedTags: [
        {
          query: 'levis jeans',
          modelName: 'RelatedTag',
          isCurated: false,
          tag: 'levis'
        },
        {
          query: 'shoes brown',
          modelName: 'RelatedTag',
          isCurated: true,
          tag: 'shoes'
        }
      ]
    });
  });
});
