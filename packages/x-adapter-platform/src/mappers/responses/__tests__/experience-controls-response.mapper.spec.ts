import { experienceControlsResponseMapper } from '../experience-controls-response.mapper';
import { PlatformExperienceControlsResponse } from '../../../types';
import {
  experienceControlsResponse,
  platformExperienceControlsResponse
} from '../../../__tests__/__fixtures__/experience-controls.response';

describe('experienceControlsResponseMapper tests', () => {
  it('should map the response', () => {
    expect(
      experienceControlsResponseMapper(
        platformExperienceControlsResponse as unknown as PlatformExperienceControlsResponse,
        {}
      )
    ).toStrictEqual(experienceControlsResponse);
  });
});
