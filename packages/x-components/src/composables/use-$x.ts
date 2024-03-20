import { UseAliasAPI, useAliasApi } from './use-alias-api';
import { useXBus, UseXBusAPI } from './use-x-bus';

/**
 * Function which returns the `$x` object from the current component instance.
 *
 * @returns The `$x` object from the current component instance.
 *
 * @public
 */
export function use$x(): UseXComponentAPI {
  const xAliasAPI = useAliasApi();
  const xBusAPI = useXBus();
  return Object.assign(xAliasAPI, xBusAPI);
}

/**
 * The XComponentAPI exposes access to the {@link @empathyco/x-bus#XBus}, and store aliases to the
 * components.
 *
 * @public
 */
export interface UseXComponentAPI extends UseXBusAPI, UseAliasAPI {}
