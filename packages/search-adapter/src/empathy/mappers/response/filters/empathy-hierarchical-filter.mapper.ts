import { HierarchicalFilter } from '@empathy/search-types';
import { injectable } from 'inversify';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';

/**
 * Hierarchical Empathy filter mapper.
 *
 * @public
 */
@injectable()
export class EmpathyHierarchicalFilterMapper implements ResponseMapper<EmpathyFilter, HierarchicalFilter> {
  map(rawFilter: EmpathyFilter, filter: HierarchicalFilter, context: ResponseMapperContext): HierarchicalFilter {
    return Object.assign<HierarchicalFilter, Partial<HierarchicalFilter>>(filter, {
      modelName: 'HierarchicalFilter',
    });
  }
}
