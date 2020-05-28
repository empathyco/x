import { XModule } from '../x-modules.types';
import { recommendationsEmitters } from './store/emitters';
import { recommendationsXStoreModule } from './store/module';
import { RecommendationsXStoreModule } from './store/types';
import { recommendationsWiring } from './wiring';

/**
 * Recommendations {@link XModule} alias.
 *
 * @public
 */

export type RecommendationsXModule = XModule<RecommendationsXStoreModule>;
/**
 * Recommendations {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `recommendations` entry point.
 *
 * @public
 */

export const recommendationsXModule: RecommendationsXModule = {
  name: 'recommendations',
  storeModule: recommendationsXStoreModule,
  storeEmitters: recommendationsEmitters,
  wiring: recommendationsWiring
};
