import { XModule } from '../x-modules.types';
import { taggingEmitters } from './store/emitters';
import { taggingXStoreModule } from './store/module';
import { TaggingXStoreModule } from './store/types';
import { taggingWiring } from './wiring';

/**
 * Tagging {@link XModule} alias.
 *
 * @public
 */
export type TaggingXModule = XModule<TaggingXStoreModule>;

/**
 * Tagging {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `empathize` entry point.
 *
 * @public
 */
export const taggingXModule: TaggingXModule = {
  name: 'tagging',
  storeModule: taggingXStoreModule,
  storeEmitters: taggingEmitters,
  wiring: taggingWiring
};
