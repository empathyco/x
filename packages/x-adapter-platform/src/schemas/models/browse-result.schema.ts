import type { Result } from '@empathyco/x-types'
import type { PlatformResultSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { mapResult } from './result.utils'

/**
 * Default implementation for the BrowseResultSchema.
 *
 * @public
 */
export const browseResultSchema = createMutableZodSchema<PlatformResultSource, Result>({
  transform: (source): Result => {
    const { tagging } = source
    return {
      ...mapResult(source),
      ...(tagging && {
        tagging: {
          add2cart: getTaggingInfoFromUrl(tagging.browseAdd2Cart as string),
          click: getTaggingInfoFromUrl(tagging.browseProduct as string),
          checkout: getTaggingInfoFromUrl(tagging.browseCheckout as string),
          displayClick: getDisplayTaggingInfoFromUrl(tagging.displayBrowseProduct as string),
        },
      }),
    }
  },
})
