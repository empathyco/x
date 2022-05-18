import { ExtraParamsRequest } from '@empathyco/x-types';
import { PlatformExtraParamsRequest } from '../../../types/requests/index';
import { extraParamsRequestMapper } from '../extra-params-request.mapper';

describe('extraParamsRequestMapper tests', () => {
  const internalRequest: ExtraParamsRequest = {
    extraParams: {
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    }
  };

  it('should map the request', () => {
    const request: PlatformExtraParamsRequest = {
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    };
    expect(extraParamsRequestMapper(internalRequest, {})).toStrictEqual(request);
  });
});
