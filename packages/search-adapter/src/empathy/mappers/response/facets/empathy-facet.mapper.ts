import { Facet } from '@empathyco/x-types-old';
import { inject, injectable } from 'inversify';
import { EmpathyAdapterConfig, FacetsConfig } from '../../../config';
import { DEPENDENCIES } from '../../../container/container.const';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFacet } from '../../../models';

/**
 * Generic Empathy facet mapper.
 *
 * @public
 */
@injectable()
export class EmpathyFacetMapper implements ResponseMapper<EmpathyFacet, Facet> {
  protected readonly facetsConfig: FacetsConfig;

  constructor(@inject(DEPENDENCIES.config) config: EmpathyAdapterConfig) {
    this.facetsConfig = config.mappings.facets;
  }

  map(rawFacet: EmpathyFacet, facet: Facet, context: ResponseMapperContext): Facet {
    const { modelName } = this.facetsConfig.named[rawFacet.facet] || this.facetsConfig.default;
    return Object.assign<Facet, Partial<Facet>>(facet, {
      id: rawFacet.facet,
      modelName,
      label: rawFacet.facet
    });
  }
}
