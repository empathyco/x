import { searchEndpointAdapter } from './endpoint-adapters/search.endpoint-adapter';
import { PlatformAdapter } from './types/platform-adapter.types';
import { empathizeEndpointAdapter } from './endpoint-adapters/empathize.endpoint-adapter';
import { topClickedEndpointAdapter } from './endpoint-adapters/top-clicked.endpoint-adapter';
import { nextQueriesEndpointAdapter } from './endpoint-adapters/next-queries.endpoint-adapter';
import { relatedTagsEndpointAdapter } from './endpoint-adapters/related-tags.endpoint-adapter';
// eslint-disable-next-line max-len
import { identifierResultsEndpointAdapter } from './endpoint-adapters/identifier-results.endpoint-adapter';
import { taggingEndpointAdapter } from './endpoint-adapters/tagging.endpoint-adapter';

export const platformAdapter: PlatformAdapter = {
  search: searchEndpointAdapter,
  empathize: empathizeEndpointAdapter,
  topClicked: topClickedEndpointAdapter,
  nextQueries: nextQueriesEndpointAdapter,
  relatedTags: relatedTagsEndpointAdapter,
  identifierResults: identifierResultsEndpointAdapter,
  tagging: taggingEndpointAdapter
};
