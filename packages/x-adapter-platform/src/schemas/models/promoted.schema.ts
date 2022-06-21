import { Promoted } from '@empathyco/x-types';
import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformPromoted } from '../../types/models/promoted.model';

export const promotedMutableSchema = createMutableSchema<Schema<PlatformPromoted, Promoted>>({
  id: 'id',
  url: 'url',
  title: 'title',
  image: 'image_url',
  modelName: () => 'Promoted',
  tagging: {
    query: ({ tagging }) => getTaggingInfoFromUrl(tagging?.query ?? '')
  }
});
