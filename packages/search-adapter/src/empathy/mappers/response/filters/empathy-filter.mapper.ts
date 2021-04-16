import { Filter } from '@empathy/search-types';
import { injectable } from 'inversify';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';

/**
 * Generic Empathy filter mapper.
 *
 * @public
 */
@injectable()
export class EmpathyFilterMapper implements ResponseMapper<EmpathyFilter, Filter> {

  map(rawFilter: EmpathyFilter, filter: Filter, context: ResponseMapperContext): Filter {
    const value = rawFilter.filter;
    const id = `${ filter.facetId }:${ value }`;

    return Object.assign<Filter, Partial<Filter>>(filter, {
      id,
      label: rawFilter.value,
      callbackInfo: {}
    });
  }
}
