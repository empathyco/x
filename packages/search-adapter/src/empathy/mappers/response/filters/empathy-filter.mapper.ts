import { Filter } from '@empathy/search-types';
import { injectable } from 'inversify';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';
import { NO_TAG_AND_FACET_REGEX } from '../../mappers.const';

/**
 * Generic Empathy filter mapper.
 *
 * @public
 */
@injectable()
export class EmpathyFilterMapper implements ResponseMapper<EmpathyFilter, Filter> {

  map(rawFilter: EmpathyFilter, filter: Filter, context: ResponseMapperContext): Filter {
    const value = rawFilter.filter.replace(NO_TAG_AND_FACET_REGEX, '');
    const id = `${ filter.facetId }:${ value }`;

    return Object.assign<Filter, Partial<Filter>>(filter, {
      id,
      label: rawFilter.value,
      selected: rawFilter.selected ?? false,
      value,
      totalResults: rawFilter.count,
      callbackInfo: {}
    });
  }
}
