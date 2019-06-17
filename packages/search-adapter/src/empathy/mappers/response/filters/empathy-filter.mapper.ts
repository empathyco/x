import { Filter } from '@empathy/search-types';
import { injectable } from 'inversify';
import { Dictionary } from '../../../../utils/utils.types';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';

@injectable()
export class EmpathyFilterMapper implements ResponseMapper<EmpathyFilter, Filter> {

  map(rawFilter: EmpathyFilter, filter: Filter, context: ResponseMapperContext): Filter {
    const selectedFilters: Dictionary<Filter> = context.selectedFilters || {};
    const previouslySelected = selectedFilters[filter.id] && selectedFilters[filter.id].selected;

    return Object.assign(filter, {
      count: rawFilter.count,
      title: rawFilter.value,
      selected: previouslySelected || rawFilter.selected || false,
      entityDetected: !previouslySelected && rawFilter.selected,
      parent: filter.parent || null,
      callbackInfo: {}
    });
  }
}
