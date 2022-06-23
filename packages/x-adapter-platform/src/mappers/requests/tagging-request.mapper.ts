import { Mapper } from '@empathyco/x-adapter';
import { TaggingRequest } from '@empathyco/x-types';

export const taggingRequestMapper: Mapper<TaggingRequest, any> = ({
  url,
  ...params
}: TaggingRequest) => params;
