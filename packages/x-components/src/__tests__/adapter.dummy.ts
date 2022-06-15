import { SearchAdapter } from '@empathyco/x-adapter';
import { PlatformAdapter } from '@empathyco/x-adapter-platform';

export const SearchAdapterDummy: SearchAdapter = {
  // Required functions
  getNextQueries: jest.fn(),
  getTopRecommendations: jest.fn(),
  getSectionRecommendations: jest.fn(),
  getQueriesRecommendations: jest.fn(),
  getClicksRecommendations: jest.fn(),
  getUserRecommendations: jest.fn(),
  getRelatedTags: jest.fn(),
  getSuggestions: jest.fn(),
  search: jest.fn(),
  searchById: jest.fn(),
  track: jest.fn(),

  // Optional functions
  invalidateCache: jest.fn(),
  setConfig: jest.fn(),
  addConfigChangedListener: jest.fn(),
  removeConfigChangedListener: jest.fn()
};

export const PlatformAdapterDummy: PlatformAdapter = {
  identifierResults: jest.fn() as any,
  nextQueries: jest.fn() as any,
  popularSearches: jest.fn() as any,
  querySuggestions: jest.fn() as any,
  recommendations: jest.fn() as any,
  relatedTags: jest.fn() as any,
  search: jest.fn() as any,
  tagging: jest.fn() as any
};
