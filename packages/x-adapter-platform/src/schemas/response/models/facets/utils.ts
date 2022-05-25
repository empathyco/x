import { facetsConfig } from '../facet.schema';
import { FacetConfig } from './types';

/**
 * Returns the facet's id.
 *
 * @param facet - The facet to resolve the id.
 * @returns The facet's id.
 */
export function getFacetId(facet: string): string {
  return facet.includes('_') ? facet.split('_')[0] : facet;
}

/**
 * Returns the facet's config.
 *
 * @param facet - The facet to resolve the configuration.
 * @returns The facet's config.
 */
export function getFacetConfig(facet: string): FacetConfig {
  const name = getFacetId(facet);
  return facetsConfig[name] ? facetsConfig[name] : facetsConfig.default;
}
