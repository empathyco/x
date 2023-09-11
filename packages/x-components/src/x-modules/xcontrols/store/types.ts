import { XActionContext, XStoreModule } from '../../../store';
import { XControlsConfig } from '../config.types';

/**
 * XControls store state.
 */
export interface XControlsState {
  /**
   * The current state of the x-controls.
   *
   * @public
   */
  isOpen: boolean;

  /**
   * The config of `X-Controls` module.
   *
   * @public
   */
  config: XControlsConfig;
}

/**
 * XControls store getters.
 */
export interface XControlsGetters {}

/**
 * XControls store mutations.
 */
export interface XControlsMutations {}

/**
 * XControls store actions.
 */
export interface XControlsActions {}

/**
 * XControls type safe store module.
 *
 * @public
 */
export type XControlsXStoreModule = XStoreModule<
  XControlsState,
  XControlsGetters,
  XControlsMutations,
  XControlsActions
>;

/**
 * Alias type for actions context of the {@link UrlXStoreModule}.
 *
 * @public
 */
export type UrlActionContext = XActionContext<
  XControlsState,
  XControlsGetters,
  XControlsMutations,
  XControlsActions
>;
