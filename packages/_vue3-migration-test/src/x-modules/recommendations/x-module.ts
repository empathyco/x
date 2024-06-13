import { PrivateXModuleOptions, RecommendationsXModule } from '../../../../x-components/src/index';
import { getResultsStub } from '../../../../x-components/src/__stubs__/index';

export const recommendationsXModule: PrivateXModuleOptions<RecommendationsXModule> = {
  storeModule: {
    state: {
      recommendations: getResultsStub(20)
    }
  }
};
