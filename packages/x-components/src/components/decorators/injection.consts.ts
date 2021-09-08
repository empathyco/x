import { ListItem } from '../../utils/types';
import { XInjectKey } from './injection.decorators';

/**
 * It's used to identify the provided and injected `items`.
 *
 * @internal
 */
export const LIST_ITEMS_KEY: XInjectKey<ListItem[] | undefined> = 'listItems';
