import { PrivateXModuleOptions } from '../../../../x-components/src/plugins/x-plugin.types';
import { ScrollXModule } from '../../../../x-components/src/x-modules/scroll/x-module';

export const scrollXModule: PrivateXModuleOptions<ScrollXModule> = {
  storeModule: {
    state: {
      pendingScrollTo: 'item-10'
    }
  }
};
