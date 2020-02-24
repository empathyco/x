// XModule
import { XModule } from '../x-modules.types';
import { nextQueriesEmitters } from './store/emitters';
import { NextQueriesXStoreModule } from './store/types';
import { nextQueriesXStoreModule } from './store/module';
import { nextQueriesWiring } from './wiring';

export type NextQueriesXModule = XModule<NextQueriesXStoreModule>;

export const nextQueriesXModule: NextQueriesXModule = {
  name: 'nextQueries',
  storeModule: nextQueriesXStoreModule,
  storeEmitters: nextQueriesEmitters,
  wiring: nextQueriesWiring
};
