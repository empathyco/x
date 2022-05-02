import { Promoted, TaggingInfo } from '@empathyco/x-types';
import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformPromoted } from '../types/response.types';

export const promotedSchema: Schema<PlatformPromoted, Promoted> = {
  id: 'id',
  url: 'url',
  title: 'title',
  image: 'image_url',
  modelName: () => 'Promoted',
  tagging: {
    query: ({ tagging }) => getTaggingInfoFromUrl(tagging?.query ?? '') as TaggingInfo
  }
};

export const promotedMutableSchema = createMutableSchema(promotedSchema);
