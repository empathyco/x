import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { Redirection } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformRedirection } from '../types/models.types';

const redirectionSchema: Schema<PlatformRedirection, Redirection> = {
  id: 'id',
  url: 'url',
  modelName: () => 'Redirection',
  tagging: {
    click: ({ tagging }) => getTaggingInfoFromUrl(tagging?.click ?? '')
  }
};

export const redirectionMutableSchema = createMutableSchema(redirectionSchema);
