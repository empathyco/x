import type { XComponentsAdapter } from '@empathyco/x-types'

export const XComponentsAdapterDummy: XComponentsAdapter = {
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
  aiSuggestions: jest.fn(),
  aiSuggestionsSearch: jest.fn(),
  aiQuestions: jest.fn(),
  aiTasks: jest.fn(),
  aiSummarize: jest.fn(),
}
