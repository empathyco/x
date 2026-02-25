import type { XComponentsAdapter } from '@empathyco/x-types'

export const XComponentsAdapterDummy: XComponentsAdapter = {
  identifierResults: jest.fn() as unknown as XComponentsAdapter['identifierResults'],
  nextQueries: jest.fn() as unknown as XComponentsAdapter['nextQueries'],
  popularSearches: jest.fn() as unknown as XComponentsAdapter['popularSearches'],
  querySuggestions: jest.fn() as unknown as XComponentsAdapter['querySuggestions'],
  recommendations: jest.fn() as unknown as XComponentsAdapter['recommendations'],
  relatedPrompts: jest.fn() as unknown as XComponentsAdapter['relatedPrompts'],
  relatedTags: jest.fn() as unknown as XComponentsAdapter['relatedTags'],
  search: jest.fn() as unknown as XComponentsAdapter['search'],
  semanticQueries: jest.fn() as unknown as XComponentsAdapter['semanticQueries'],
  tagging: jest.fn() as unknown as XComponentsAdapter['tagging'],
  experienceControls: jest.fn() as unknown as XComponentsAdapter['experienceControls'],
  aiSuggestions: jest.fn() as unknown as XComponentsAdapter['aiSuggestions'],
  aiSuggestionsSearch: jest.fn() as unknown as XComponentsAdapter['aiSuggestionsSearch'],
  aiQuestions: jest.fn() as unknown as XComponentsAdapter['aiQuestions'],
  aiTasks: jest.fn() as unknown as XComponentsAdapter['aiTasks'],
  aiSummarize: jest.fn() as unknown as XComponentsAdapter['aiSummarize'],
  facets: jest.fn() as unknown as XComponentsAdapter['facets'],
}
