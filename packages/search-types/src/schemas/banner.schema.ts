import { Banner } from '../banner.model';
import { TaggingSchema } from './tagging.schema';

/**
 * Jest schema for validating Banner entities.
 *
 * @public
 */
export const BannerSchema: Banner = {
  id: expect.any(String),
  image: expect.any(String),
  modelName: expect.any(String),
  tagging: {
    click: TaggingSchema
  },
  title: expect.any(String),
  url: expect.any(String)
};
