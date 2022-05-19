import { Mapper } from '@empathyco/x-adapter-next';
import { ExtraParamsRequest } from '@empathyco/x-types';
import { PlatformExtraParamsRequest } from '../../types/requests/request.types';

export const extraParamsRequestMapper: Mapper<ExtraParamsRequest, PlatformExtraParamsRequest> = ({
  extraParams
}) => ({
  ...(extraParams as unknown as PlatformExtraParamsRequest)
});
