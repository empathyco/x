import { Adapter } from '@empathyco/x-adapter';

export const SearchAdapterDummy: Adapter = {
  identifierResults: jest.fn(),
  nextQueries: jest.fn(),
  popularSearches: jest.fn(),
  querySuggestions: jest.fn(),
  recommendations: jest.fn(),
  relatedTags: jest.fn(),
  search: jest.fn(),
  tagging: jest.fn()
};
