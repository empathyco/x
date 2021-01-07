import { RelatedTag } from '@empathy/search-types';
import { QueryableRequest } from '../../../../types';
import { EmpathyRequestRelatedTagsQueryMapper } from '../../../mappers/request/params/empathy-request-related-tags-query.mapper';

const relatedTagsMapper = new EmpathyRequestRelatedTagsQueryMapper();

it('Appends related tags to query', () => {
  const query = 'lego';
  const relatedTags: RelatedTag[] = [
    { modelName: 'RelatedTag', tag: 'city', previous: 'lego', query: 'lego city', selected: true },
    { modelName: 'RelatedTag', tag: 'friends', previous: 'lego', query: 'lego friends', selected: true },
    { modelName: 'RelatedTag', tag: 'playmobil farm', previous: 'lego', query: 'lego playmobil farm', selected: true }
  ];
  const rawRequest: QueryableRequest = {
    query: query,
    relatedTags: relatedTags
  };

  const requestMapped = relatedTagsMapper.map(rawRequest, query);
  expect(requestMapped).toBe('lego city friends playmobil farm');
});

it('Does not apply related tags if are empty', () => {
  const query = 'lego';
  const rawRequest: QueryableRequest = { query: 'This is never used' };

  const requestMapped = relatedTagsMapper.map(rawRequest, query);
  expect(requestMapped).toBe('lego');
});
