export interface AiQuestion {
  id: string
  type: string
  metadata: {
    origin: string
    source: string
    createdAt: string
    generatedWithModel: string
    generatedWithConfig: string
  }
  suggestionText: string
  suggestionImageUrl?: string
  responseText?: string
  content: {
    responseText?: string
    searchQueries: string[]
  }
  expanded?: boolean
  tagging?: {
    toolingDisplay: string
    toolingDisplayClick: string
    searchQueries: Record<
      string,
      {
        toolingDisplay: string
        toolingDisplayAdd2Cart: string
        toolingDisplayClick: string
      }
    >
  }
}
