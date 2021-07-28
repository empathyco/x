import { RelatedTagSchema } from '@empathyco/x-types-old/schemas';
import { RelatedTagsSimpleResponse } from '../../__fixtures__/responses/related-tags.response';
import { adapter } from '../../__mocks__/adapter.mocks';
import { getFetchMock } from '../../__mocks__/fetch.mock';

beforeEach(jest.clearAllMocks);

it('gets related tags successfully', async () => {
  window.fetch = jest.fn(getFetchMock(RelatedTagsSimpleResponse));

  const response = await adapter.getRelatedTags({ query: 'lego' });

  expect(response.relatedTags).everyItemToMatch(RelatedTagSchema);
  expect(response.relatedTags).toHaveLength(RelatedTagsSimpleResponse.length);
});
