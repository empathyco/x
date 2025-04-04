import type { PlatformResult } from './result.model'

/**
 * Partial results model in platform.
 *
 * @public
 */
export interface PlatformPartialResult {
  term: string
  numFound: number
  content: PlatformResult[]
}
