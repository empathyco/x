/**
 * Checks if the error was thrown because the request was aborted. This happens when a newer
 * request with the same id is made, so that newer request is in charge of the status.
 *
 * @param error - The error to check.
 * @returns True if the error is an `AbortError`.
 * @internal
 */
export function isAbortError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false
  }
  const { name, code } = error as { name?: string; code?: number }
  // AbortError code === 20
  return name === 'AbortError' || code === 20
}
