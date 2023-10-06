import { ExperienceControlsRequest } from '@empathyco/x-types';
import { experienceControlsRequestMapper } from '../experience-controls-request.mapper';

describe('experienceControlsRequestMapper tests', () => {
  it('should map the request', () => {
    const request: ExperienceControlsRequest = {
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile'
      }
    };

    expect(experienceControlsRequestMapper(request, {})).toStrictEqual({
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile'
      }
    });
  });
});
