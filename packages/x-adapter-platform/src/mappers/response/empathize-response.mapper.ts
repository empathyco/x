import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import {
  EmpathizeResponse,
  PlatformEmpathizeResponse
} from '../../types/responses/empathize-response.model';
import { empathizeResponseMutableSchema } from '../../schemas/response/empathize-response.schema';

export const empathizeResponseMapper = schemaMapperFactory<
  PlatformEmpathizeResponse,
  EmpathizeResponse
>(empathizeResponseMutableSchema);
