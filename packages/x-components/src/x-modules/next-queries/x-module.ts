import { XModule } from '../x-modules.types';
import { nextQueriesEmitters } from './store/emitters';
import { nextQueriesXStoreModule } from './store/module';
import { NextQueriesXStoreModule } from './store/types';
import { nextQueriesWiring } from './wiring';

/**
 * NextQueries {@link XModule} alias.
 *
 * @public
 */
export type NextQueriesXModule = XModule<NextQueriesXStoreModule>;

/**
 * Next queries {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `next-queries` entry point.
 *
 * @public
 */
export const nextQueriesXModule: NextQueriesXModule = {
  name: 'nextQueries',
  storeModule: nextQueriesXStoreModule,
  storeEmitters: nextQueriesEmitters,
  wiring: nextQueriesWiring
};
