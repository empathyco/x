import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import {
  PlatformTopClickedResponse,
  TopClickedResponse
} from '../../types/responses/top-clicked-response.model';
import { resultMutableSchema } from '../result.schema';

export const topClickedResponseSchema: Schema<PlatformTopClickedResponse, TopClickedResponse> = {
  results: {
    $path: 'topclicked.content',
    $subSchema: resultMutableSchema
  }
};

export const topClickedResponseMutableSchema = createMutableSchema(topClickedResponseSchema);
