import type { Redirection } from '@empathyco/x-types';
import type { PlatformRedirection } from '../../types/models/redirection.model';
import { createMutableSchema } from '@empathyco/x-adapter';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';

/**
 * Default implementation for the RedirectionSchema.
 *
 * @public
 */
export const redirectionSchema = createMutableSchema<PlatformRedirection, Redirection>({
  id: 'id',
  url: 'url',
  modelName: () => 'Redirection',
  tagging: {
    click: ({ tagging }) => getTaggingInfoFromUrl(tagging?.click ?? '')
  }
});
