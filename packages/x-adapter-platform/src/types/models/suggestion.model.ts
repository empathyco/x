/**
 * Suggestion model for the `platform` API.
 *
 * @public
 */
export interface PlatformSuggestion {
  // TODO: Remove title_raw when endpoint changes and removes it permanently
  title_raw?: string
  keywords: string
}
