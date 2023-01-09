import { createMutableSchema } from '@empathyco/x-adapter';
import { Promoted } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';
import { PlatformPromoted } from '../../types/models/promoted.model';

export const promotedSchema = createMutableSchema<PlatformPromoted, Promoted>({
  id: 'id',
  url: 'url',
  title: 'title',
  image: 'image_url',
  position: 'position',
  modelName: () => 'Promoted',
  tagging: {
    query: ({ tagging }) => getTaggingInfoFromUrl(tagging?.query ?? '')
  }
});
