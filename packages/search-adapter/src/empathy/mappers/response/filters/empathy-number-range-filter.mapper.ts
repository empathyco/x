import { NumberRangeFilter } from '@empathyco/x-types';
import { injectable } from 'inversify';
import { ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { EmpathyFilter } from '../../../models';

/**
 * Number Range Empathy filter mapper.
 *
 * @public
 */
@injectable()
export class EmpathyNumberRangeFilterMapper implements ResponseMapper<EmpathyFilter, NumberRangeFilter> {
  map(rawFilter: EmpathyFilter, filter: NumberRangeFilter, context: ResponseMapperContext): NumberRangeFilter {
    const [min, max] = rawFilter.value.split(':');

    return Object.assign<NumberRangeFilter, Partial<NumberRangeFilter>>(filter, {
      modelName: 'NumberRangeFilter',
      range: {
        min: Number.parseFloat(min) || null,
        max: Number.parseFloat(max) || null
      }
    });
  }
}
