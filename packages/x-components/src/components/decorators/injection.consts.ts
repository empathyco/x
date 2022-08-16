import { Result } from '@empathyco/x-types';
import { ListItem } from '../../utils/types';
import { XInjectKey } from './injection.decorators';

/**
 * It's used to identify the provided and injected `items`.
 *
 * @internal
 */
export const LIST_ITEMS_KEY: XInjectKey<ListItem[] | undefined> = 'listItems';

/**
 * It's used to identify the provided and injected `query`.
 *
 * @internal
 */
export const QUERY_KEY: XInjectKey<string | undefined> = 'query';

export const RESULT_KEY: XInjectKey<Result> = 'result';

export const SELECTED_VARIANTS_INDEXES_KEY: XInjectKey<number[]> = 'selectedIndexes';

export const SET_RESULT_VARIANT_KEY = 'setResultVariant';
