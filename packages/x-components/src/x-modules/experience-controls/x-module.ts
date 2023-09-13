import { XModule } from '../x-modules.types';

/**
 * Search {@link XModule} alias.
 *
 * @public
 */
export type ExperienceControlsXModule = XModule<any>;

/**
 * Search {@link XModule} implementation. This module is auto-registered as soon as you
 * import any component from the `x-controls` entry point.
 *
 * @public
 */
export const experienceControlsXModule: ExperienceControlsXModule = {
  name: 'experienceControls',
  storeModule: {},
  storeEmitters: {},
  wiring: {}
};
