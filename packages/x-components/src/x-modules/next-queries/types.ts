import { NextQuery } from '../../../../search-types';
import { ListItem } from '../../utils';

/**
 * Next queries group interface for the NextQueries.
 *
 * @public
 */
export interface NextQueriesGroup extends ListItem {
  modelName: 'NextQueriesGroup';
  nextQueries: NextQuery[];
}
