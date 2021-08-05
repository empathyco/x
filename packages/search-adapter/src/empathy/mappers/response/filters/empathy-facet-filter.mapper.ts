import { FacetFilter } from '@empathyco/x-types-next';
import { injectable } from 'inversify';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';

/**
 * Generic Empathy filter mapper.
 *
 * @public
 */
@injectable()
export class EmpathyFacetFilterMapper implements ResponseMapper<EmpathyFilter, FacetFilter> {
  map(rawFilter: EmpathyFilter, filter: FacetFilter, context: ResponseMapperContext): FacetFilter {
    const value = rawFilter.filter;
    const id = `${ filter.facetId }:${ value }`;

    return Object.assign<FacetFilter, Partial<FacetFilter>>(filter, {
      id,
    });
  }
}
