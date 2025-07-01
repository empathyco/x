import type { RelatedPrompt } from '@empathyco/x-types'

/**
 * Filters and sorts related prompts based on whether their next queries include
 * any word from the given query.
 *
 * @param relatedPrompts - Array of RelatedPrompt objects to filter and sort.
 * @param query - The query string to match against next queries.
 * @returns Array of RelatedPrompt objects with sorted nextQueries.
 */
export function getRelatedPromptsByQuery(
  relatedPrompts: Array<RelatedPrompt>,
  query: string,
): Array<RelatedPrompt> {
  const curatedRelatedPrompts = removeDuplicatesByNextQueries(relatedPrompts)
  return curatedRelatedPrompts
    .filter(relatedPrompt =>
      relatedPrompt.nextQueries.some((nextQuery: string) => isQueryIncluded(nextQuery, query)),
    )
    .map(relatedPrompt => ({
      ...relatedPrompt,
      nextQueries: relatedPrompt.nextQueries.sort((a, b) => {
        const foundInA = isQueryIncluded(a, query)
        const foundInB = isQueryIncluded(b, query)

        if (foundInA === foundInB) {
          return 0
        }

        return foundInA ? -1 : 1
      }),
    }))
}

/**
 * Checks if any word from the query is included in the given text.
 *
 * @param text - The text to search within.
 * @param query - The query string containing words to search for.
 * @returns True if any word from the query is found in the text, otherwise false.
 */
function isQueryIncluded(text: string, query: string): boolean {
  const queryWords = query.trim().toLowerCase().split(' ')
  const textWords = text.trim().toLowerCase().split(' ')
  return queryWords.some(queryWord => textWords.includes(queryWord))
}

/**
 * Removes related prompts that mach at leat 2 nextQueries with another relatedPrompt.
 *
 * @param relatedPrompts - Array of RelatedPrompt objects to remove duplicated nextQueries.
 * @returns Array of RelatedPrompt objects with no duplicated nextQueries.
 */
function removeDuplicatesByNextQueries(relatedPrompts: Array<RelatedPrompt>): Array<RelatedPrompt> {
  const uniquePromptsMap: Array<RelatedPrompt> = []

  for (const currentPrompt of relatedPrompts) {
    let hasMatch = false

    for (const previousPrompt of uniquePromptsMap) {
      const matches = currentPrompt.nextQueries.filter(query =>
        previousPrompt.nextQueries.includes(query),
      )
      if (matches.length >= 2) {
        hasMatch = true
        break
      }
    }

    if (!hasMatch) {
      uniquePromptsMap.push(currentPrompt)
    }
  }

  return uniquePromptsMap
}
