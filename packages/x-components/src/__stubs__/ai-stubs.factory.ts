import type { AiQuestion } from '@empathyco/x-types'

/**
 * Creates an array of stubbed AI questions.
 *
 * @param amount - Number of AI questions to create.
 * @returns Array of AI questions stub.
 *
 * @internal
 */
export function getAiQuestionsStub(amount = 5): AiQuestion[] {
  return Array.from({ length: amount }, (_, index) =>
    createAiQuestionStub(`AI Question ${index + 1}`),
  )
}

/**
 * Creates a single AI question stub.
 *
 * @param text - The text of the AI question.
 * @returns An AI question.
 */
export function createAiQuestionStub(text: string): AiQuestion {
  return {
    id: `ai-question-${text.replace(/\s+/g, '-').toLowerCase()}`,
    type: 'default',
    metadata: {
      origin: 'stub',
      source: 'test',
      createdAt: new Date().toISOString(),
      generatedWithModel: 'stub-model',
      generatedWithConfig: 'stub-config',
    },
    suggestionText: text,
    suggestionImageUrl: 'https://example.com/image.png',
    responseText: `Response for ${text}`,
    content: {
      responseText: `Content response for ${text}`,
      searchQueries: [`search for ${text}`],
    },
    expanded: false,
    tagging: {
      toolingDisplay: 'display-tag',
      toolingDisplayClick: 'display-click-tag',
      searchQueries: {
        [`search for ${text}`]: {
          toolingDisplay: 'display-tag',
          toolingDisplayAdd2Cart: 'add2cart-tag',
          toolingDisplayClick: 'click-tag',
        },
      },
    },
  }
}
