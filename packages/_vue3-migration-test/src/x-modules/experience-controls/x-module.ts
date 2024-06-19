import { PrivateXModuleOptions } from '../../../../x-components/src/plugins/x-plugin.types';
import { ExperienceControlsXModule } from '../../../../x-components/src/x-modules/experience-controls/x-module';

export const experienceControlsXModule: PrivateXModuleOptions<ExperienceControlsXModule> = {
  storeModule: {
    state: {
      controls: { numberOfCarousels: 10, resultsPerCarousels: 6 },
      events: { ColumnsNumberProvided: 6 },
      status: 'initial',
      params: {}
    }
  }
} as PrivateXModuleOptions<ExperienceControlsXModule>;
