/**
 * Request for the `Questions v1` endpoint.
 *
 * @public
 */
export interface PlatformAIQuestionsRequest {
  context: {
    lang: string
    instance?: string
    filters?: Record<string, unknown>
    query?: string
  }
}
