import { getCurrentInstance } from 'vue';
import { XComponentAPI } from '../plugins';

/**
 * Function which returns the `$x` object from the current component instance.
 *
 * @returns The `$x` object from the current component instance.
 *
 * @public
 */
export function use$x(): XComponentAPI {
  return (getCurrentInstance()?.proxy as unknown as { $x: XComponentAPI }).$x;
}
