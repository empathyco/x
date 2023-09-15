import { createStoreEmitters } from '../../../store';
import { experienceControlsXStoreModule } from './module';

/**
 * {@link StoreEmitters} For the {@link ExperienceControlsXModule}.
 *
 * @internal
 */
export const experienceControlsEmitters = createStoreEmitters(experienceControlsXStoreModule, {
  ExperienceControlsClosed: {
    selector: state => state.events
  }
});
