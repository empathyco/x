import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { Redirection } from '@empathyco/x-types';
import { PlatformRedirection } from '../../types/models/redirection.model';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';

export const redirectionSchema = createMutableSchema<Schema<PlatformRedirection, Redirection>>({
  id: 'id',
  url: 'url',
  modelName: () => 'Redirection',
  tagging: {
    click: ({ tagging }) => getTaggingInfoFromUrl(tagging?.click ?? '')
  }
});
