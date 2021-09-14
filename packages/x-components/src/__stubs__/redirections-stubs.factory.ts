import { Redirection } from '@empathyco/x-types';

/**
 * Creates {@link @empathyco/x-types#Redirection | redirections} stub.
 *
 * @returns A list of redirections.
 *
 * @internal
 */
export function getRedirectionsStub(): Redirection[] {
  return [createRedirectionStub('help')];
}

/**
 * Creates a redirection with a unique identifier.
 *
 * @param title - The redirection title.
 *
 * @returns A redirection.
 *
 * @internal
 */
export function createRedirectionStub(title: string): Redirection {
  return {
    id: `xr-${title}`,
    title,
    url: `https://shop.empathy.co/${title}`,
    tagging: {
      click: {
        params: {},
        url: ''
      }
    },
    modelName: 'Redirection'
  };
}
