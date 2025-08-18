import { createStoreEmitters } from '../../../store'
import { aiXStoreModule } from './module'

/* {@link StoreEmitters} For the AI module. */
export const aiEmitters = createStoreEmitters(aiXStoreModule, {})
