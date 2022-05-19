import { Promoted } from '@empathyco/x-types';
import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformPromoted } from '../../../types/responses/models/promoted.model';

export const promotedSchema: Schema<PlatformPromoted, Promoted> = {
  id: 'id',
  url: 'url',
  title: 'title',
  image: 'image_url',
  modelName: () => 'Promoted',
  tagging: {
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
    query: ({ tagging }) =>
      tagging?.query ? getTaggingInfoFromUrl(tagging.query) : { url: '', params: {} }
  }
};

export const promotedMutableSchema = createMutableSchema(promotedSchema);
