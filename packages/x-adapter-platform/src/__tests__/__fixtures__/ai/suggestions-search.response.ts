import type { AiSuggestionsSearchResponse } from '@empathyco/x-types'
import type { PlatformAiSuggestionsSearchResponse } from '../../../types'
import { platformResult, result } from '../result'

export const platformAiSuggestionsSearchResponse: PlatformAiSuggestionsSearchResponse = {
  items: [
    {
      query: 'test1',
      results: [platformResult],
      numFound: 10,
      tagging: {
        query: 'test1QueryTagging',
      },
    },
    {
      query: 'test2',
      results: [platformResult],
      numFound: 5,
      tagging: { query: 'test2QueryTagging' },
    },
  ],
  tagging: {
    query: 'test3QueryTagging',
    add2cart: 'test3Add2CartTagging',
    click: 'test3ClickTagging',
    checkout: 'test3CheckoutTagging',
    display: 'test3DisplayTagging',
    displayClick: 'test3DisplayClickTagging',
  },
}

export const aiSuggestionsSearchResponse: AiSuggestionsSearchResponse = {
  suggestions: [
    {
      query: 'test1',
      results: [result],
      numFound: 10,
      tagging: {
        query: { url: 'test1QueryTagging', params: { follow: false } },
      },
    },
    {
      query: 'test2',
      results: [result],
      numFound: 5,
      tagging: {
        query: { url: 'test2QueryTagging', params: { follow: false } },
      },
    },
  ],
  suggestionsTagging: {
    query: { url: 'test3QueryTagging', params: { follow: false } },
    add2cart: { url: 'test3Add2CartTagging', params: { follow: false } },
    click: { url: 'test3ClickTagging', params: { follow: false } },
    checkout: { url: 'test3CheckoutTagging', params: { follow: false } },
    display: { url: 'test3DisplayTagging', params: { follow: false } },
    displayClick: { url: 'test3DisplayClickTagging', params: { follow: false } },
  },
}
