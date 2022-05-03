import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { Redirection, TaggingInfo } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformRedirection } from '../types/models.types';

const redirectionSchema: Schema<PlatformRedirection, Redirection> = {
  id: 'id',
  url: 'url',
  modelName: () => 'Redirection',
  tagging: {
    click: ({ tagging }) => getTaggingInfoFromUrl(tagging?.click ?? '') as TaggingInfo
  }
};

export const redirectionMutableSchema = createMutableSchema(redirectionSchema);
