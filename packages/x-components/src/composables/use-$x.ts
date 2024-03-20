import { XComponentAPI } from '../plugins';
import { useAliasApi } from './use-alias-api';
import { useXBus } from './use-x-bus';

/**
 * Function which returns the `$x` object from the current component instance.
 *
 * @returns The `$x` object from the current component instance.
 *
 * @public
 */
export function use$x(): XComponentAPI {
  const xAliasAPI = useAliasApi();
  const xBusAPI = useXBus();
  const $x = Object.assign(xAliasAPI, xBusAPI);
  return $x;
}
