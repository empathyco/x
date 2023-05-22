import { XModule } from '../x-modules.types';
import { semanticQueriesEmitters } from './store/emitters';
import { semanticQueriesXStoreModule } from './store/module';
import { SemanticQueriesXStoreModule } from './store/types';
import { semanticQueriesWiring } from './wiring';

/**
 * QueriesPreview {@link XModule} alias.
 *
 * @public
 */
export type SemanticQueriesXModule = XModule<SemanticQueriesXStoreModule>;

/**
 * QueriesPreview {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `queries-preview` entry point.
 *
 * @public
 */
export const semanticQueriesXModule: SemanticQueriesXModule = {
  name: 'semanticQueries',
  storeModule: semanticQueriesXStoreModule,
  storeEmitters: semanticQueriesEmitters,
  wiring: semanticQueriesWiring
};
