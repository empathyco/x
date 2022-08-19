import { Result, ResultVariant } from '@empathyco/x-types';
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

/**
 * It's used to identify the provided and injected `result`.
 *
 * @internal
 */
export const RESULT_KEY: XInjectKey<Result> = 'result';

/**
 * It's used to identify the provided and injected `selectedVariants` of a result.
 *
 * @internal
 */
export const SELECTED_VARIANTS_KEY: XInjectKey<ResultVariant[]> = 'selectedVariants';

/**
 * It's used to identify the provided and injected `setResultVariant` callback.
 *
 * @internal
 */
export const SET_RESULT_VARIANT_KEY: XInjectKey<(level: number, variant: ResultVariant) => void> =
  'setResultVariant';
