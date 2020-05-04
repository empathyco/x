import { createStoreEmitters } from '../../../store';
import { relatedTagsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the related-tags module.
 *
 * @internal
 */

export const relatedTagsEmitters = createStoreEmitters(relatedTagsXStoreModule, {});
