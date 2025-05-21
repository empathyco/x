import type { XComponentsAdapter } from '@empathyco/x-types'

export const XComponentsAdapterDummy: XComponentsAdapter = {
  browse: jest.fn(),
  identifierResults: jest.fn(),
  nextQueries: jest.fn(),
  popularSearches: jest.fn(),
  querySuggestions: jest.fn(),
  recommendations: jest.fn(),
  relatedPrompts: jest.fn(),
  relatedTags: jest.fn(),
  search: jest.fn(),
  semanticQueries: jest.fn(),
  tagging: jest.fn(),
  experienceControls: jest.fn(),
}
