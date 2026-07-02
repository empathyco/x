import { createStoreEmitters } from '../../../store'
import { isStringEmpty } from '../../../utils/string'
import { browseXStoreModule } from './module'

/**
 * {@link StoreEmitters} For the browse module.
 *
 * @internal
 */
export const browseEmitters = createStoreEmitters(browseXStoreModule, {
  FacetsChanged: {
    selector: state => state.facets,
    filter(newValue, oldValue): boolean {
      return newValue.length !== 0 || oldValue.length !== 0
    },
  },
  PageChanged: state => state.page,
  ResultsChanged: state => state.results,
  BrowseRequestChanged: (_, getters) => getters.request,
  BrowseRequestUpdated: (_, getters) => getters.request,
  BrowseResponseChanged: {
    selector: (state, getters) => {
      return {
        request: getters.request!,
        status: state.status,
        banners: state.banners,
        facets: state.facets,
        promoteds: state.promoteds,
        browseTagging: state.browseTagging,
        displayBrowseTagging: state.displayBrowseTagging,
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
  BrowseTaggingChanged: {
    selector: state => state.browseTagging,
    filter: ({ url }) => !isStringEmpty(url),
  },
  SortChanged: state => state.sort,
})
