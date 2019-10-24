import { Facet, Suggestion } from '@empathy/search-types';
import { injectable, multiInject } from 'inversify';
import { DEPENDENCIES } from '../../../container/container.const';
import { MapResponse, ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFacet, EmpathySuggestion } from '../../../models';
import { pipeMappers } from '../../pipe-mappers';

@injectable()
export class EmpathySuggestionFacetsMapper implements ResponseMapper<EmpathySuggestion, Suggestion> {
  private readonly mapFacet: MapResponse<EmpathyFacet, Facet>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.facets)   facetMappers: ResponseMapper<EmpathyFacet, Facet>[]
  ) {
    this.mapFacet = pipeMappers(...facetMappers);
  }

  map({ facets }: EmpathySuggestion, suggestion: Suggestion, context: ResponseMapperContext): Suggestion {
    return Object.assign<Suggestion, Partial<Suggestion>>(suggestion, {
      facets: facets ? this.generateFacets(facets, context) : []
    });
  }

  private generateFacets(rawFacets: EmpathyFacet[], context: ResponseMapperContext): Facet[] {
    return rawFacets.map(rawFacet => {
      const mappedFacet = this.mapFacet(rawFacet, {} as Facet, context);
      return mappedFacet;
    });
  }
}
