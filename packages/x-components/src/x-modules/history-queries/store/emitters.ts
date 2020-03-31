import { createStoreEmitters } from '../../../store';
import { historyQueriesXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the history-queries module.
 *
 * @internal
 */
export const historyQueriesEmitters = createStoreEmitters(historyQueriesXStoreModule, {});
