import { Wiring } from './wiring.types';

/**
 * Util function to generate type-safe wiring.
 * If TypeScript ever accepts the PR about generic type inference this function can be removed.
 *
 * @param wiring - The wiring to create.
 * @returns Type-safe wiring.
 * @public
 */
export function createWiring<T extends Partial<Wiring>>(wiring: T): T {
  return wiring;
}
