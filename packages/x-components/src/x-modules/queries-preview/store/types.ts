import { XActionContext, XStoreModule } from '../../../store/index';

/**
 * QueriesPreview store state.
 *
 * @public
 */
export interface QueriesPreviewState {}

/**
 * QueriesPreview store getters.
 *
 * @public
 */
export interface QueriesPreviewGetters {}

/**
 * QueriesPreview store mutations.
 *
 * @public
 */
export interface QueriesPreviewMutations {}

/**
 * QueriesPreview store actions.
 *
 * @public
 */
export interface QueriesPreviewActions {}

/**
 * QueriesPreview type safe store module.
 *
 * @public
 */
export type QueriesPreviewXStoreModule = XStoreModule<
  QueriesPreviewState,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewActions
>;

/**
 * Alias type for actions context of the {@link QueriesPreviewXStoreModule}.
 *
 * @public
 */
export type QueriesPreviewActionContext = XActionContext<
  QueriesPreviewState,
  QueriesPreviewGetters,
  QueriesPreviewMutations,
  QueriesPreviewActions
>;
