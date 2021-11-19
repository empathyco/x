import { XInjectKey } from '../../../components/decorators/injection.decorators';
import { ScrollVisibilityObserver } from './scroll.types';

/**
 * Constant to inject the first visible item observer.
 *
 * @internal
 */
export const ScrollObserverKey: XInjectKey<ScrollVisibilityObserver | null> = 'ScrollObserverKey';
