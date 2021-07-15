import { XModule } from '../x-modules.types';
import { identifierResultsEmitters } from './store/emitters';
import { identifierResultsXStoreModule } from './store/module';
import { IdentifierResultsXStoreModule } from './store/types';
import { identifierResultsWiring } from './wiring';

/**
 * IdentifierResults {@link XModule} alias.
 *
 * @public
 */
export type IdentifierResultsXModule = XModule<IdentifierResultsXStoreModule>;

/**
 * IdentifierResults {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `identifier-results` entry point.
 *
 * @public
 */
export const identifierResultsXModule: IdentifierResultsXModule = {
  name: 'identifierResults',
  storeModule: identifierResultsXStoreModule,
  storeEmitters: identifierResultsEmitters,
  wiring: identifierResultsWiring
};
