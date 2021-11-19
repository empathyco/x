import { Banner } from '../banner.model';
import { IdentifiableSchema } from './identifiable.schema';
import { TaggingInfoSchema } from './tagging.schema';

/**
 * Jest schema for validating Banner entities.
 *
 * @public
 */
export const BannerSchema: Banner = {
  ...IdentifiableSchema,
  tagging: {
    click: TaggingInfoSchema
  },
  image: expect.any(String),
  modelName: expect.any(String),
  title: expect.any(String),
  url: expect.any(String)
};
