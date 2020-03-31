import { XStoreModule } from '../../../store';

/**
 * HistoryQueries store state.
 *
 * @public
 */
export interface HistoryQueriesState {}
/**
 * HistoryQueries store getters.
 *
 * @public
 */
export interface HistoryQueriesGetters {}
/**
 * HistoryQueries store mutations.
 *
 * @public
 */
export interface HistoryQueriesMutations {}
/**
 * HistoryQueries store actions.
 *
 * @public
 */
export interface HistoryQueriesActions {}
/**
 * HistoryQueries type safe store module.
 *
 * @public
 */
export type HistoryQueriesXStoreModule = XStoreModule<
  HistoryQueriesState,
  HistoryQueriesGetters,
  HistoryQueriesMutations,
  HistoryQueriesActions
>;
