import { Promoted } from './promoted.model';
import { TaggingSchema } from './tagging.schema';

export const PromotedSchema: Promoted = {
  id: expect.any(String),
  image: expect.any(String),
  modelName: expect.any(String),
  tagging: {
    click: TaggingSchema
  },
  title: expect.any(String),
  url: expect.any(String)
};
