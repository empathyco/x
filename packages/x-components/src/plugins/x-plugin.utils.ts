import { ExtractGetters, XModuleName } from '../x-modules/x-modules.types';
import { XPluginOptions } from './x-plugin.types';

/**
 * Asserts that the passed options object is valid, providing helpful error messages.
 *
 * @param options - The options to check if they are valid.
 */
export function assertXPluginOptionsAreValid(
  options: XPluginOptions | undefined
): asserts options is XPluginOptions {
  if (!options) {
    throw new Error(
      // eslint-disable-next-line max-len
      'XPlugin needs to be installed with an options object containing at least an adapter. Please provide a valid object'
    );
  }

  if (options.adapter == null) {
    throw new Error(
      // eslint-disable-next-line max-len
      "The options object doesn't seem to have an adapter. Please, create one and pass it through the options object"
    );
  }
}

/**
 * Generates a getter path string with the module and getter name.
 *
 * @param moduleName - The module name the getter belongs to.
 * @param getterName - The getter name.
 * @returns A string representing the getter path.
 * @public
 */
export function getGetterPath<ModuleName extends XModuleName>(
  moduleName: ModuleName,
  getterName: keyof ExtractGetters<ModuleName>
): string {
  return `x/${moduleName}/${getterName as string}`;
}
