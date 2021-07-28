import { Sort } from '@empathyco/x-types-old';
import { injectable } from 'inversify';
import { RequestMapper } from '../../../empathy-adapter.types';

/**
 * Empathy SaaS API mapper for the {@link SearchRequest.sort} parameter. It excludes empty or undefined values from
 * the sort.
 *
 * @public
 */
@injectable()
export class EmpathyRequestSortMapper implements RequestMapper<Sort | undefined, string | undefined> {
    map(rawSort: Sort | undefined): string | undefined {
        return rawSort || undefined;
    }
}
