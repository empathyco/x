import { XComponentsAdapter } from '@empathyco/x-types';

export const XComponentsAdapterDummy: XComponentsAdapter = {
  identifierResults: jest.fn(),
  nextQueries: jest.fn(),
  popularSearches: jest.fn(),
  querySuggestions: jest.fn(),
  recommendations: jest.fn(),
  relatedTags: jest.fn(),
  search: jest.fn(),
  tagging: jest.fn()
};
