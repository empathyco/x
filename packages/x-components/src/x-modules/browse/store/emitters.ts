import { createStoreEmitters } from '../../../store'
import { isStringEmpty } from '../../../utils/string'
import { browseXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the browse module.
 *
 * @internal
 */
export const browseEmitters = createStoreEmitters(browseXStoreModule, {
  FacetsChanged: state => state.facets,
  BrowseRequestChanged: (_, getters) => getters.browseRequest,
  BrowseTaggingChanged: {
    selector: state => state.browseTagging,
    filter: ({ url }) => !isStringEmpty(url),
  },
  BrowseResponseChanged: {
    selector: (state, getters) => {
      return {
        request: getters.browseRequest!,
        status: state.status,
        facets: state.facets,
        displayTagging: state.displayTagging,
        results: state.results,
        totalResults: state.totalResults,
      }
    },
    filter: (newValue, oldValue) => {
      return (
        newValue.status !== oldValue.status && oldValue.status === 'loading' && !!newValue.request
      )
    },
  },
})
