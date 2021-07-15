// XModule
import { XModule } from '../x-modules.types';
import { relatedTagsEmitters } from './store/emitters';
import { relatedTagsXStoreModule } from './store/module';
import { RelatedTagsXStoreModule } from './store/types';
import { relatedTagsWiring } from './wiring';

/**
 * RelatedTags {@link XModule} alias.
 *
 * @public
 */

export type RelatedTagsXModule = XModule<RelatedTagsXStoreModule>;

/**
 * RelatedTags {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `related-tags` entry point.
 *
 * @public
 */

export const relatedTagsXModule: RelatedTagsXModule = {
  name: 'relatedTags',
  storeModule: relatedTagsXStoreModule,
  storeEmitters: relatedTagsEmitters,
  wiring: relatedTagsWiring
};
