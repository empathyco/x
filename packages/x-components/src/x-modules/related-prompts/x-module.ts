import { XPlugin } from '../../plugins/x-plugin';
import { XModule } from '../x-modules.types';
import { RelatedPromptsXStoreModule } from './store/types';
import { relatedPromptsXStoreModule } from './store/module';
import { relatedPromptsWiring } from './wiring';
import { relatedPromptsStoreEmitters } from './store/index';

/**
 * RelatedPrompts {@link XModule} alias.
 *
 * @public
 */
export type RelatedPromptsXModule = XModule<RelatedPromptsXStoreModule>;

/**
 * Related Prompts {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `related-prompts` entry point.
 *
 * @public
 */
export const relatedPromptsXModule: RelatedPromptsXModule = {
  name: 'relatedPrompts',
  storeModule: relatedPromptsXStoreModule,
  storeEmitters: relatedPromptsStoreEmitters,
  wiring: relatedPromptsWiring
};

XPlugin.registerXModule(relatedPromptsXModule);
