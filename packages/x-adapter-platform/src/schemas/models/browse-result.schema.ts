import type { Result } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { mapResult, platformResultValidator } from './platform-result.validator'

/**
 * Default implementation for the BrowseResultSchema.
 *
 * @public
 */
export const browseResultSchema = createMutableZodSchema({
  source: platformResultValidator,
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
