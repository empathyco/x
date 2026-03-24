/**
 * Request for the ai suggestions endpoint.
 *
 * @public
 */
export interface PlatformAiSuggestionsRequest {
  context: {
    query?: string
    lang: string
    instance?: string
    filters?: Record<string, unknown>
  }
}
