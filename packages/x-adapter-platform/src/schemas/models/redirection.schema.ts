import { createMutableSchema } from '@empathyco/x-adapter';
import { Redirection } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';
import { PlatformRedirection } from '../../types/models/redirection.model';

export const redirectionSchema = createMutableSchema<PlatformRedirection, Redirection>({
  id: 'id',
  url: 'url',
  modelName: () => 'Redirection',
  tagging: {
    click: ({ tagging }) => getTaggingInfoFromUrl(tagging?.click ?? '')
  }
});
