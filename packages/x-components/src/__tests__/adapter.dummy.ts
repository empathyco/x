import { SearchAdapter } from '@empathy/search-adapter';

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
