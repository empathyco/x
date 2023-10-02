import { ExperienceControlsXStoreModule } from '../types';

/**
 * Default implementation for the {@link ExperienceControlsGetters.experienceControlsResultsRequest}
 * getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the controls
 * results module.
 * @returns The params results request to fetch data from the API.
 *
 * @public
 */

// eslint-disable-next-line max-len
export const experienceControlsResultsRequest: ExperienceControlsXStoreModule['getters']['experienceControlsResultsRequest'] =
  ({ params, controls }) => {
    return controls
      ? {
          extraParams: params
        }
      : null;
  };
