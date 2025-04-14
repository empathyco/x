import type { Promoted } from '@empathyco/x-types'
import type { PlatformPromoted } from '../../types/models/promoted.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'

/**
 * Default implementation for the PromotedSchema.
 *
 * @public
 */
export const promotedSchema = createMutableSchema<PlatformPromoted, Promoted>({
  id: 'id',
  url: 'url',
  title: 'title',
  image: 'image_url',
  position: 'position',
  modelName: () => 'Promoted',
  tagging: {
    click: ({ tagging }) => getTaggingInfoFromUrl(tagging?.click ?? ''),
  },
})
