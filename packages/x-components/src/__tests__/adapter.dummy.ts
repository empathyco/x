import type { XComponentsAdapter } from '@empathyco/x-types'
import { vi } from 'vitest'

export const XComponentsAdapterDummy: XComponentsAdapter = {
  identifierResults: vi.fn() as unknown as XComponentsAdapter['identifierResults'],
  nextQueries: vi.fn() as unknown as XComponentsAdapter['nextQueries'],
  popularSearches: vi.fn() as unknown as XComponentsAdapter['popularSearches'],
  querySuggestions: vi.fn() as unknown as XComponentsAdapter['querySuggestions'],
  recommendations: vi.fn() as unknown as XComponentsAdapter['recommendations'],
  relatedPrompts: vi.fn() as unknown as XComponentsAdapter['relatedPrompts'],
  relatedTags: vi.fn() as unknown as XComponentsAdapter['relatedTags'],
  search: vi.fn() as unknown as XComponentsAdapter['search'],
  semanticQueries: vi.fn() as unknown as XComponentsAdapter['semanticQueries'],
  tagging: vi.fn() as unknown as XComponentsAdapter['tagging'],
  experienceControls: vi.fn() as unknown as XComponentsAdapter['experienceControls'],
  aiSuggestions: vi.fn() as unknown as XComponentsAdapter['aiSuggestions'],
  aiSuggestionsSearch: vi.fn() as unknown as XComponentsAdapter['aiSuggestionsSearch'],
  facets: vi.fn() as unknown as XComponentsAdapter['facets'],
  browse: vi.fn() as unknown as XComponentsAdapter['browse'],
}
