import type { VendorXStoreModule } from '../types'
import { createRelatedTagsQueryGetter } from '../../../../store/utils/query.utils'

export const query: VendorXStoreModule['getters']['query'] = createRelatedTagsQueryGetter({
  getRelatedTags: state => state.relatedTags,
})
