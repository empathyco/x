import { RelatedTagsXModule } from '../../../../x-components/src/x-modules/related-tags/x-module';
import { PrivateXModuleOptions } from '../../../../x-components/src/plugins/x-plugin.types';
export const relatedTagsXModule: PrivateXModuleOptions<RelatedTagsXModule> = {
  storeModule: {
    state: {
      query: 'pistacho'
    }
  }
};
