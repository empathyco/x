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
    text,
    modelName: 'AiQuestion',
    // Add other properties as needed for your AiQuestion type
  }
}
