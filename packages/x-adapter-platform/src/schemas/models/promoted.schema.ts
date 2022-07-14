import { Promoted } from '@empathyco/x-types';
import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { PlatformPromoted } from '../../types/models/promoted.model';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';

export const promotedSchema = createMutableSchema<Schema<PlatformPromoted, Promoted>>({
  id: 'id',
  url: 'url',
  title: 'title',
  image: 'image_url',
  modelName: () => 'Promoted',
  tagging: {
    query: ({ tagging }) => getTaggingInfoFromUrl(tagging?.query ?? '')
  }
});
