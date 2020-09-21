import { FilterModel, SimpleFilter } from '@empathy/search-types';
import { injectable } from 'inversify';
import { ResponseMapper } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';
import { NO_TAG_AND_FACET_REGEX } from '../../mappers.const';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathySimpleFilterMapper implements ResponseMapper<EmpathyFilter, SimpleFilter> {
  map(rawFilter: EmpathyFilter, filter: SimpleFilter): SimpleFilter {
    if (this.isSimpleFilter(filter)) {
      const filterValue = rawFilter.filter.replace(NO_TAG_AND_FACET_REGEX, '');
      const id = `${ filter.facet.modelName }:${ filterValue }`;
      Object.assign<SimpleFilter, Partial<SimpleFilter>>(filter, {
        id,
        value: {
          filter: filterValue
        }
      });
    }
    return filter;
  }

  private isSimpleFilter({ modelName }: SimpleFilter): boolean {
    return modelName === FilterModel.simple;
  }
}
