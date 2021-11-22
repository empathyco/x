import { XInjectKey } from '../../../components/decorators/injection.decorators';
import { ScrollVisibilityObserver } from './scroll.types';

/**
 * Constant to inject the first visible item observer.
 *
 * @internal
 */
export const ScrollObserverKey: XInjectKey<ScrollVisibilityObserver | null> = 'ScrollObserverKey';
/**
 * The default scroll id for all the scroll components.
 *
 * @internal
 */
export const MainScrollId = 'main-scroll';
