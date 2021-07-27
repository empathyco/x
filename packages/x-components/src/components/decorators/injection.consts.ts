import { SearchItem } from '../../utils/types';
import { XInjectKey } from './injection.decorators';

/**
 * It's used to identify the provided and injected `searchItems`.
 *
 * @internal
 */
export const SEARCH_ITEMS_KEY: XInjectKey<SearchItem[] | undefined> = 'searchItems';
