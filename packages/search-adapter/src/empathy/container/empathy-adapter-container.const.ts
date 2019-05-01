import { EntityNames, FeatureNames } from '../../models';

const Requestors: Record<FeatureNames, symbol> = {
  search: Symbol.for('SearchRequestor'),
  nextQueries: Symbol.for('NextQueriesRequestor'),
  recommendations: Symbol.for('ReccommendationsRequestor'),
  relatedTags: Symbol.for('RelatedTagsRequestor'),
  suggestions: Symbol.for('SuggestionsRequestor'),
  searchById: Symbol.for('SearchByIdRequestor')
};

const Mappers: Record<EntityNames, symbol> = {
  banners: Symbol.for('banners'),
  facets: Symbol.for('facets'),
  nextQueries: Symbol.for('nextQueries'),
  partialResults: Symbol.for('partialResults'),
  promoteds: Symbol.for('promoteds'),
  queryTagging: Symbol.for('queryTagging'),
  redirections: Symbol.for('redirections'),
  relatedTags: Symbol.for('relatedTags'),
  results: Symbol.for('results'),
  spellcheck: Symbol.for('spellcheck'),
  suggestions: Symbol.for('suggestions'),
  totalResults: Symbol.for('totalResults')
};

export const DEPENDENCIES = {
  httpClient: Symbol.for('HttpClient'),
  requestParamsMapper: Symbol.for('RequestParamsMapper'),
  config: Symbol.for('Config'),
  mappersProvider: Symbol.for('MappersProvider'),
  Requestors,
  Mappers
};
