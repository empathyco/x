import Vue, { ComponentOptions } from 'vue';
import { XPlugin } from '../plugins/x-plugin';
import { AnyXModule, XModuleName } from '../x-modules/x-modules.types';
import { XComponent, XComponentOptions } from './x-component.types';
import { setXComponentXModuleName } from './x-component.utils';

/**
 * Initializes a component as an X-Component:
 * * Registers the module passed as parameter.
 * * Flags the component as X-Component, so then it can be detected with the {@link isXComponent}
 * function.
 * Creates props for each config option in the store module, and creates a link between the prop
 * and the store value If the component has a `setConfig` method, then this method will be called
 * when any of the config props changes.
 *
 * @param module - The module associated to the X-Component using this mixin.
 * @param config - Optional {@link XComponentOptions} options.
 * @returns Mixin for the module.
 * @public
 */
export function xComponentMixin(
  module: AnyXModule,
  { configPropsNames = Object.keys(module.storeModule.state().config) }: XComponentOptions = {}
): ComponentOptions<Vue> & ThisType<XComponent> {
  XPlugin.registerXModule(module);
  return {
    props: configPropsNames,
    beforeCreate(): void {
      setXComponentXModuleName(this, module.name);
    },
    created(): void {
      /* Iterate through config props, creating a watcher for each one of them that will try to
       call the setConfig component method or if that method does not exist, the setConfig
        mutation of the module */
      configPropsNames.forEach(configPropName => {
        const watcher = getWatcherCallback(this, module.name, configPropName);
        const initialConfigPropValue = this.$props[configPropName];
        if (initialConfigPropValue !== undefined) {
          watcher(initialConfigPropValue);
        }
        this.$watch(configPropName, watcher);
      });
    }
  };
}

/**
 * Creates a watcher callback to be used when a configuration prop changes.
 *
 * @param component - The component instance to generate the watcher for.
 * @param moduleName - The {@link XModule} name that this component belongs to.
 * @param configPropName - The config prop name of the watcher to create.
 * @returns Function which will be the watcher callback to set the config into store.
 */
function getWatcherCallback(
  component: XComponent,
  moduleName: XModuleName,
  configPropName: string
): (configPropValue: any) => void {
  return typeof component.setConfig === 'function'
    ? (configPropValue: any) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        component.setConfig!(configPropName, configPropValue);
      }
    : (configPropValue: any) => {
        component.$store.commit(`x/${moduleName}/setConfig`, {
          [configPropName]: configPropValue
        });
      };
}
