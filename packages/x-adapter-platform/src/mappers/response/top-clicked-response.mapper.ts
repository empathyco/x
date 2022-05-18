import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import {
  PlatformTopClickedResponse,
  TopClickedResponse
} from '../../types/responses/top-clicked-response.model';
// eslint-disable-next-line max-len
import { topClickedResponseMutableSchema } from '../../schemas/response/top-clicked-response.schema';

export const topClickedResponseMapper = schemaMapperFactory<
  PlatformTopClickedResponse,
  TopClickedResponse
>(topClickedResponseMutableSchema);
