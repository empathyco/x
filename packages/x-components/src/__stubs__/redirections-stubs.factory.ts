import { Redirection } from '@empathyco/x-types';

/**
 * Creates a {@link @empathyco/x-types#Redirection | redirections} stub.
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
 * @param id - The redirection identifier.
 *
 * @returns A redirection.
 *
 * @internal
 */
export function createRedirectionStub(id: string): Redirection {
  return {
    id: `xr-${id}`,
    url: `https://picsum.photos/seed/${id}/500`,
    tagging: {
      click: {
        params: {},
        url: ''
      }
    },
    modelName: 'Redirection'
  };
}
