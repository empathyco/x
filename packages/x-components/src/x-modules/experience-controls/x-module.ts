import { XModule } from '../x-modules.types';
import { experienceControlsEmitters } from './store/emitters';
import { experienceControlsXStoreModule } from './store/module';
import { ExperienceControlsXStoreModule } from './store/types';
import { experienceControlsWiring } from './wiring';

/**
 * Search {@link XModule} alias.
 *
 * @public
 */
export type ExperienceControlsXModule = XModule<ExperienceControlsXStoreModule>;

/**
 * Search {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `x-controls` entry point.
 *
 * @public
 */
export const experienceControlsXModule: ExperienceControlsXModule = {
  name: 'experienceControls',
  storeModule: experienceControlsXStoreModule,
  storeEmitters: experienceControlsEmitters,
  wiring: experienceControlsWiring
};
