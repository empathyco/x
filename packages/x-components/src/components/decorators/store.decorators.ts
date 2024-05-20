import Vue, { ComponentOptions } from 'vue';
import { createDecorator } from 'vue-class-component';
import { getGetterPath } from '../../plugins/x-plugin.utils';
import { DecoratorFor } from '../../utils/index';
import { ExtractGetters, ExtractState, XModuleName } from '../../x-modules/x-modules.types';

/**
 * Generates a computed property which returns the selected state.
 *
 * The decorated property needs to be public for type inference to work.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @param path - The state path.
 * @returns Decorator with the state properties of the module.
 *
 * @public
 * @deprecated Use {@link useState} composable instead.
 */
export function State<Module extends XModuleName, Path extends keyof ExtractState<Module>>(
  module: Module,
  path: Path
): DecoratorFor<ExtractState<Module>[Path]> {
  return createDecorator((options, key) => {
    if (!options.computed) {
      options.computed = {};
    }
    Object.assign(options.computed, {
      [key]() {
        return this.$store.state.x[module][path];
      }
    } as ThisType<Vue>);
  });
}

/**
 * Generates a computed property which returns the selected getter value.
 *
 * The decorated property needs to be public for type inference to work.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @param getter - The getter name.
 * @returns Decorator with the getters of the module.
 *
 * @public
 * @deprecated Use {@link useGetter} composable instead.
 */
export function Getter<Module extends XModuleName, GetterName extends keyof ExtractGetters<Module>>(
  module: Module,
  getter: GetterName
): DecoratorFor<ExtractGetters<Module>[GetterName]> {
  return createDecorator((options: ComponentOptions<Vue>, key: string) => {
    if (!options.computed) {
      options.computed = {};
    }
    const getterPath = getGetterPath(module, getter);
    Object.assign(options.computed, {
      [key]() {
        return this.$store.getters[getterPath];
      }
    } as ThisType<Vue>);
  });
}
