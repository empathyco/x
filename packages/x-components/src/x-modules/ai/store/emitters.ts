import { createStoreEmitters } from '../../../store'
import { aiXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the ai module.
 *
 * @internal
 */
export const aiEmitters = createStoreEmitters(aiXStoreModule, {
  AiQuestionsRequestUpdated: (_, getters) => getters.request,
})
