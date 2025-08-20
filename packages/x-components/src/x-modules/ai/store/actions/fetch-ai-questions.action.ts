import type { AiQuestion, AiQuestionsRequest } from '@empathyco/x-types'
import type { AiActionContext, AiXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins/x-plugin'

/**
 * Default implementation for the {@link AiActions.fetchAiQuestions}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The ai request to make.
 * @returns The ai response.
 *
 * @public
 */
export const fetchAiQuestions: AiXStoreModule['actions']['fetchAiQuestions'] = async (
  { commit },
  request,
) => {
  if (!request) {
    return null
  }

  const questionsState = {
    query: request.query ?? '',
    state: { questions: [], loading: true },
  }
  commit('setQuestionsByQuery', questionsState)

  return XPlugin.adapter.aiQuestions(request).then(async ({ resolved, taskId, items }) => {
    const hasItems = Array.isArray(items) && items.length > 0

    if (hasItems || resolved) {
      commit('setQuestionsByQuery', {
        ...questionsState,
        state: { questions: items ?? [], loading: false },
      })
      return items
    }

    return fetchTasks(taskId, questionsState, request, commit)
  })
}

/**
 * Recursive task fetching function that will keep trying to fetch tasks until they are resolved or the maximum number of attempts is reached.
 * @param taskId - The task id to fetch.
 * @param questionsState - The questions state to update.
 * @param request - The ai request to make.
 * @param commit - The commit function to update the state.
 * @param attempts - The number of attempts made so far.
 *
 * @internal
 *
 */
async function fetchTasks(
  taskId: string,
  questionsState: {
    query: string
    state: { questions: AiQuestion[]; loading: boolean }
  },
  request: AiQuestionsRequest,
  commit: AiActionContext['commit'],
  attempts = 0,
): Promise<AiQuestion[] | null> {
  const response = await XPlugin.adapter.aiTasks({ taskId, extraParams: request?.extraParams })
  const { resolved, items } = response.result

  if (!resolved && attempts < 20) {
    attempts++
    await new Promise(resolve => setTimeout(resolve, 500))
    await fetchTasks(taskId, questionsState, request, commit, attempts)
  }
  commit('setQuestionsByQuery', {
    ...questionsState,
    state: { questions: items ?? [], loading: false },
  })
  return items ?? null
}
