import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { Redirection } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformRedirection } from '../../../types/responses/models/redirection.model';

const redirectionSchema: Schema<PlatformRedirection, Redirection> = {
  id: 'id',
  url: 'url',
  modelName: () => 'Redirection',
  tagging: {
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
    query: ({ tagging }) =>
      tagging?.click ? getTaggingInfoFromUrl(tagging.click) : { url: '', params: {} }
  }
};

export const redirectionMutableSchema = createMutableSchema(redirectionSchema);
