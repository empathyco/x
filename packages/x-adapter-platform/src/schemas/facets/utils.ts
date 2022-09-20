import { facetsConfig } from '../models/facet.schema';
import { FacetConfig } from './types';

/**
 * Returns the facet's config.
 *
 * @param facet - The facet to resolve the configuration.
 * @returns The facet's config.
 */
export function getFacetConfig(facet: string): FacetConfig {
  return facetsConfig[facet] ?? facetsConfig.default;
}
