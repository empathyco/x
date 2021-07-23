import { SearchItem } from '../../utils/types';
import { XInjectKey } from './injection.decorators';

/**
 *
 */
export const SEARCH_ITEMS_KEY: XInjectKey<SearchItem[] | undefined> = 'searchItems';
