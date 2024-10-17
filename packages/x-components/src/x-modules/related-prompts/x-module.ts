import { XPlugin } from '../../plugins/x-plugin';
import { XModule } from '../x-modules.types';
import { RelatedPromptsXStoreModule } from './store/types';
import { relatedPromptsXStoreModule } from './store/module';
import { relatedPromptsStoreEmitters } from './store/emitters';
import { relatedPromptsWiring } from './wiring';

/**
 * RelatedPrompts {@link XModule} alias.
 */
export type RelatedPromptsXModule = XModule<RelatedPromptsXStoreModule>;

/**
 * Related Prompts {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `related-prompts` entry point.
 */
export const relatedPromptsXModule: RelatedPromptsXModule = {
  name: 'relatedPrompts',
  storeModule: relatedPromptsXStoreModule,
  storeEmitters: relatedPromptsStoreEmitters,
  wiring: relatedPromptsWiring
};

XPlugin.registerXModule(relatedPromptsXModule);
