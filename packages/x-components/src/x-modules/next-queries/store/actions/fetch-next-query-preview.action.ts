import type { NextQueriesXStoreModule } from '../types'
import { XPlugin } from '../../../../plugins/x-plugin'
import { createOrigin } from '../../../../utils/origin'

/**
 * Default implementation for the {@link NextQueriesActions.fetchNextQueryPreview}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param context.state - state context.
 * @param payload - The next query and the {@link FeatureLocation | location} to send in the
 * request.
 * @param payload.query - query payload.
 * @param payload.location - query payload.
 * @returns A Promise of a SearchResponse when it fetches the results, `null` if the request was
 * not made.
 */
export const fetchNextQueryPreview: NextQueriesXStoreModule['actions']['fetchNextQueryPreview'] =
  async ({ state }, { query, location }) => {
    if (!query) {
      return null
    }
    const origin = createOrigin({ feature: 'next_query', location }) ?? undefined

    return XPlugin.adapter.search(
      {
        query,
        rows: state.config.maxPreviewItemsToRequest,
        extraParams: state.params,
        origin,
      },
      {
        id: `fetchNextQueryPreview-${query}`,
      },
    )
  }
