import { SimpleFilter } from '@empathyco/x-types-old';
import { injectable } from 'inversify';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';

/**
 * Simple Empathy filter mapper.
 *
 * @public
 */
@injectable()
export class EmpathySimpleFilterMapper implements ResponseMapper<EmpathyFilter, SimpleFilter> {
  map(rawFilter: EmpathyFilter, filter: SimpleFilter, context: ResponseMapperContext): SimpleFilter {
    return Object.assign<SimpleFilter, Partial<SimpleFilter>>(filter, {
      modelName: 'SimpleFilter'
    });
  }
}
