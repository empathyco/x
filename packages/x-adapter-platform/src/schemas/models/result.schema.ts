import type { Result } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { mapResult, platformResultValidator } from './platform-result.validator'

/**
 * Default implementation for the ResultSchema.
 *
 * @public
 */
export const resultSchema = createMutableZodSchema({
  source: platformResultValidator,
  transform: (source): Result => {
    const { tagging } = source
    return {
      ...mapResult(source),
      ...(tagging && {
        tagging: {
          add2cart: getTaggingInfoFromUrl(tagging.add2cart as string),
          checkout: getTaggingInfoFromUrl(tagging.checkout as string),
          click: getTaggingInfoFromUrl(tagging.click as string),
          displayClick: getDisplayTaggingInfoFromUrl(tagging.displayClick as string),
        },
      }),
    }
  },
})
