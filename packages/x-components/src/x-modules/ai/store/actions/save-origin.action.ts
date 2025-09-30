import type { QueryOrigin } from '../../../../types/origin'
import type { AiXStoreModule } from '../types'
import { createOrigin } from '../../../../utils/origin'

/**
 * Default implementation for the {@link AiActions.saveOrigin}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param queryOriginInit - The object to create the {@link QueryOrigin} with.
 * @public
 */
export const saveOrigin: AiXStoreModule['actions']['saveOrigin'] = (
  { commit },
  queryOriginInit,
) => {
  commit('setOrigin', createOrigin(queryOriginInit) as QueryOrigin | null)
}
