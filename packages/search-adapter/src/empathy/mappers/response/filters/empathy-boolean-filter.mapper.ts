import { BooleanFilter, Filter } from '@empathyco/x-types';
import { injectable } from 'inversify';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';

/**
 * Generic Empathy BooleanFilter mapper.
 *
 * @public
 */
@injectable()
export class EmpathyBooleanFilterMapper implements ResponseMapper<EmpathyFilter, Filter> {
  map(rawFilter: EmpathyFilter, filter: BooleanFilter, context: ResponseMapperContext): BooleanFilter {
    return Object.assign<BooleanFilter, Partial<BooleanFilter>>(filter, {
      label: rawFilter.value,
      selected: rawFilter.selected ?? false,
      totalResults: rawFilter.count
    });
  }
}
