import type { Redirection } from '@empathyco/x-types'
import type { PlatformRedirectionSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { defined } from '../utils'

/**
 * Default implementation for the RedirectionSchema.
 *
 * @public
 */
export const redirectionSchema = createTransformSchema<PlatformRedirectionSource, Redirection>({
  transform: (source): Redirection => ({
    ...defined<Pick<Redirection, 'id' | 'url'>>({ id: source.id, url: source.url }),
    modelName: 'Redirection',
    tagging: {
      click: getTaggingInfoFromUrl(source.tagging?.click ?? ''),
    },
  }),
})
