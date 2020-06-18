import { FilterModel, RangeFilter } from '@empathy/search-types';
import { injectable } from 'inversify';
import { ResponseMapper } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';

@injectable()
export class EmpathyRangeFilterMapper implements ResponseMapper<EmpathyFilter, RangeFilter> {
  map(rawFilter: EmpathyFilter, filter: RangeFilter): RangeFilter {
    if (this.isRangeFilter(filter) && rawFilter.value) {
      const [min, max] = rawFilter.value.split(':');
      const id = `${ filter.facet.modelName }:${ min || '*' } TO ${ max || '*' }`;

      return Object.assign<RangeFilter, Partial<RangeFilter>>(filter, {
        id,
        value: {
          min: Number.parseFloat(min) || null,
          max: Number.parseFloat(max) || null
        }
      });
    }
    return filter;
  }

  private isRangeFilter({ modelName }: RangeFilter): boolean {
    return modelName === FilterModel.range || modelName === FilterModel.currencyRange;
  }
}
