import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { Redirection } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformRedirection } from '../../types/models/redirection.model';

export const redirectionMutableSchema = createMutableSchema<
  Schema<PlatformRedirection, Redirection>
>({
  id: 'id',
  url: 'url',
  modelName: () => 'Redirection',
  tagging: {
    click: ({ tagging }) => getTaggingInfoFromUrl(tagging?.click ?? '')
  }
});
