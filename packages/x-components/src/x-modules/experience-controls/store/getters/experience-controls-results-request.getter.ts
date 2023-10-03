import { ExperienceControlsXStoreModule } from '../types';

/**
 * Default implementation for the {@link ExperienceControlsGetters.experienceControlsRequest}
 * getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the controls
 * results module.
 * @returns The params results request to fetch data from the API.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const experienceControlsRequest: ExperienceControlsXStoreModule['getters']['experienceControlsRequest'] =
  ({ params }) => {
    return {
      extraParams: params
    };
  };
