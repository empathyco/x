import { SimpleFacet, SimpleFilter } from '@empathy/search-types';
import { injectable, multiInject } from 'inversify';
import { DEPENDENCIES } from '../../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFacet, EmpathyFilter } from '../../../models';
import { pipeMappers } from '../../pipe-mappers';

/**
 * Simple Empathy facet mapper.
 *
 * @public
 */
@injectable()
export class EmpathySimpleFacetMapper implements ResponseMapper<EmpathyFacet, SimpleFacet> {
  protected readonly mapFilter: MapFn<EmpathyFilter, SimpleFilter>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.simpleFilter) filterMappers: ResponseMapper<EmpathyFilter, SimpleFilter>[]
  ) {
    this.mapFilter = pipeMappers(...filterMappers);
  }

  map(rawFacet: EmpathyFacet, facet: SimpleFacet, context: ResponseMapperContext): SimpleFacet {
    if (facet.modelName === 'SimpleFacet') {
      Object.assign<SimpleFacet, Partial<SimpleFacet>>(facet, {
        filters: this.mapFilters(facet, rawFacet.values, context)
      });
    }
    return facet;
  }

  protected mapFilters(facet: SimpleFacet, rawFilters: EmpathyFilter[] = [], context: ResponseMapperContext): SimpleFilter[] {
    return rawFilters.map(rawFilter => this.mapFilter(rawFilter, { facetId: facet.id } as SimpleFilter, context));
  }
}
