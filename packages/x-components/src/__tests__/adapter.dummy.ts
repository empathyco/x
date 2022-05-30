import { PlatformAdapter } from '@empathyco/x-adapter-platform';

export const SearchAdapterDummy: PlatformAdapter = {
  identifierResults: jest.fn() as any,
  nextQueries: jest.fn() as any,
  popularSearches: jest.fn() as any,
  querySuggestions: jest.fn() as any,
  recommendations: jest.fn() as any,
  relatedTags: jest.fn() as any,
  search: jest.fn() as any,
  tagging: jest.fn() as any
};
