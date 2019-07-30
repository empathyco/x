import { Filter } from '@empathy/search-types';
import { injectable } from 'inversify';
import { Dictionary } from '../../../../utils/utils.types';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';

@injectable()
export class EmpathyFilterMapper implements ResponseMapper<EmpathyFilter, Filter> {

  map(rawFilter: EmpathyFilter, filter: Filter, context: ResponseMapperContext): Filter {
    const selectedFilters: Dictionary<Filter> = context.selectedFilters || {};
    const selected = !!selectedFilters[filter.id];

    Object.assign(filter, {
      count: rawFilter.count,
      title: rawFilter.value,
      entityDetected: false, // TODO Remove this from the facet model as it is not used anymore
      parent: filter.parent || null,
      callbackInfo: {}
    });
    this.mapSelectedPropertyInHierarchy(filter, selected);
    return filter;
  }

  protected mapSelectedPropertyInHierarchy(filter: Filter, selected: boolean) {
    filter.selected = selected;
    if (filter.parent && selected) {
      this.mapSelectedPropertyInHierarchy(filter.parent, selected);
    }
  }
}
