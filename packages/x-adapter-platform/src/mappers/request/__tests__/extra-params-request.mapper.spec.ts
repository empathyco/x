import { ExtraParamsRequest } from '@empathyco/x-types';
import { extraParamsRequestMapper } from '../extra-params-request.mapper';

describe('extraParamsRequestMapper tests', () => {
  it('should map the request', () => {
    const internalRequest: ExtraParamsRequest = {
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile',
        randomField: 'randomValue'
      }
    };

    expect(extraParamsRequestMapper(internalRequest, {})).toStrictEqual({
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile',
      randomField: 'randomValue'
    });
  });
});
