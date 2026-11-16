import type { Result } from '@empathyco/x-types'
import type { PlatformResultSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { mapResult } from './result.utils'

/**
 * Default implementation for the ResultSchema.
 *
 * @public
 */
export const resultSchema = createMutableZodSchema<PlatformResultSource, Result>({
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
