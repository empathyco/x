import Vue, { ComponentOptions } from 'vue';
import { createDecorator } from 'vue-class-component';
import { arrayToObject } from '../../utils/array';
import { DecoratorFor } from '../../utils/types';

/**
 * The type of the Vue Component provide configuration, narrowed to the object type.
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/ban-types
type ProvideObjectConfig = Exclude<ComponentOptions<Vue>['provide'], (() => object) | undefined>;

/**
 * The type of the Vue Component inject configuration, narrowed to the object type.
 *
 * @internal
 */
type InjectObjectConfig = Exclude<ComponentOptions<Vue>['inject'], string[] | undefined>;

/**
 * Type of the key passed to {@link XProvide} and {@link XInject} to be type-safe. With this type
 * you can declare the type of the injected value directly in the injection key.
 *
 * @example
 * `const myKey: XInjectKey<Filter> = 'myFilter';`
 * `@XInject(myKey)`
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface XInjectKey<Type> extends String {}

/**
 * The union type for the different functions in this module.
 *
 * @internal
 */
type AnyInjectKey<Type> = XInjectKey<Type> | string;

/**
 * Generates a provide function that returns an object with the injectable value returned in a
 * getter to keep its reactivity, using the default
 * {@link https://vuejs.org/v2/api/#provide-inject | Vue inject}. It overrides the provide key if
 * the parent provides the same key.
 *
 * @remarks The decorated property needs to be public for type inference to work.
 *
 * @param provideKey - The key used to provide. This key can be a 'string' or a 'XInject<Type>'.
 * This last type is to support type-safe injection. When this decorator is used, it is possible
 * to specify the type of the injected value. Take a look to the example below.
 * @returns Decorator with the provide configuration.
 *
 * @example
 * Type unsafe injection (but allowed):
 *     \@XProvide('myKey')
 *
 * Type safe injection (recommended):
 *     const myKey: XInjectKey<Date> = 'myKey';
 *     \@XProvide(myKey)
 *
 * This last one, you are specifying that the injected value with the key 'myKey' has the Date
 * type.
 *
 * @public
 */
export function XProvide<Type>(provideKey: AnyInjectKey<Type>): DecoratorFor<Type> {
  return createDecorator((options, componentKey) => {
    const previousProvide = options.provide;
    options.provide = function <ComponentInstance extends Vue>(this: ComponentInstance) {
      const previousProvideObject = getPreviousProvideObject(previousProvide, this);
      const newProvideObject = getNewProvideObject(provideKey, componentKey, this);
      return Object.assign(previousProvideObject, newProvideObject);
    };
  });
}

/**
 * Generates an inject configuration object to inject a value provided by {@link XProvide}.
 * This function injects the value into a private property of the component instance using the
 * default {@link https://vuejs.org/v2/api/#provide-inject | Vue inject}. This private property
 * is named as the decorated property but prefixed with `_x-inject_`.
 *
 * Why is this private property necessary? Well, the {@link XProvide} decorator, provides an object
 * with the shape \{ value: any \} being that value a getter to keep reactivity of the injected
 * value. This private property is to "shortcut" that object and directly inject the value itself.
 * Otherwise, you should access to the actual value using `.value`.
 *
 * The final step is done by a computed property. This has the same name as the decorated property.
 * This computed returns the inner value getter of the injected object. This way the decorated
 * property has finally the initial injected value.
 *
 * @remarks The decorated property needs to be public for type inference to work.
 *
 * @param injectKey - The key used to inject. This key can be a 'string' or a 'XInject<Type>'.
 * This last type is to support type-safe injection. When this decorator is used, it is possible
 * to specify the type of the injected value. Take a look to the example below.
 * @returns Decorator with the provide configuration.
 *
 * @param defaultValue - The default value to use if there is not value provided.
 *
 * @example
 * Type unsafe injection (but allowed):
 *     \@XInject('myKey')
 *
 * Type safe injection (recommended):
 *     const myKey: XInjectKey<Date> = 'myKey';
 *     \@XInject(myKey)
 *
 * @public
 */
export function XInject<Type>(
  injectKey: AnyInjectKey<Type>,
  defaultValue?: Type
): DecoratorFor<Type> {
  return createDecorator((options, componentKey) => {
    const privateComponentKey = `_x-inject_${componentKey}`;
    const previousInjectObject = getPreviousInjectObject(options.inject);
    const newInjectObject = getNewInjectObject(injectKey, privateComponentKey, defaultValue);
    options.inject = Object.assign(previousInjectObject, newInjectObject);
    const computedToPrivateProperty = getComputedProperty(componentKey, privateComponentKey);
    options.computed = Object.assign(options.computed ?? {}, computedToPrivateProperty);
  });
}

/**
 * This function receives the previous provide of the component instance.
 * If the provide is a function, then returns it as an object invoking it with the component
 * instance.
 * If the provide is an object then it is returned directly.
 * If the provide is undefined, then an empty object returned.
 *
 * @param previousProvide - The {@link ComponentOptions.provide } configuration that exist before
 * applying this decorator.
 * @param componentInstance - A Vue Component instance to invoke the provide function.
 *
 * @returns {@link ProvideObjectConfig} With the provide configuration as an object.
 */
function getPreviousProvideObject<ComponentInstance extends Vue>(
  previousProvide: ComponentOptions<Vue>['provide'],
  componentInstance: ComponentInstance
): ProvideObjectConfig {
  if (isProvideFunction(previousProvide)) {
    return previousProvide.call(componentInstance);
  } else {
    return previousProvide ?? {};
  }
}

/**
 * This function creates a new provide configuration, wrapping the value to provide inside a getter
 * called `value`. This is done to keep the reactivity of the injected value.
 *
 * @param provideKey - The key of the provide value.
 * @param componentKey - The name of the property decorated with {@link XProvide}.
 * @param componentInstance - The {@link Vue} instance of the component to invoke the provide
 * function.
 *
 * @returns {@link ProvideObjectConfig} The object with the key of the provideKey and the `value`
 * getter.
 */
function getNewProvideObject<ComponentInstance extends Vue>(
  provideKey: AnyInjectKey<unknown>,
  componentKey: string,
  componentInstance: ComponentInstance
): ProvideObjectConfig {
  return {
    [provideKey as string]: {
      get value() {
        return componentInstance[componentKey as keyof ComponentInstance];
      }
    }
  };
}

/**
 * This function returns the previous inject config as an object. This will be used to merge it with
 * the new inject configuration.
 * If the previous inject config of the component instance is an Array, then it converts it into an
 * object.
 * If the previous inject config of the component instance is an object, then it returns it
 * directly.
 * If the previous inject config of the component instance is undefined, then an empty object is
 * returned.
 *
 * @param previousInject - The previous inject configuration of the component instance.
 *
 * @returns {@link InjectObjectConfig} The object with the previous inject config in form of object.
 */
function getPreviousInjectObject(
  previousInject: ComponentOptions<Vue>['inject']
): InjectObjectConfig {
  if (Array.isArray(previousInject)) {
    return arrayToObject(previousInject);
  } else {
    return previousInject ?? {};
  }
}

/**
 * This function returns the new inject configuration. This will be merged with the previous inject
 * configuration.
 * It returns an object with the key and a string if no `defaultValue` is passed. Otherwise it
 * returns an object with `from` and `default` keys.
 *
 * @param injectKey - The key of the injected value.
 * @param componentKey - The name of the component key where the value will be injected.
 * @param defaultValue - The default value of the injection if the `injectKey` has no provide.
 *
 * @returns The object with the inject configuration.
 */
function getNewInjectObject<DefaultValue>(
  injectKey: AnyInjectKey<unknown>,
  componentKey: string,
  defaultValue?: DefaultValue
): InjectObjectConfig {
  return { [componentKey]: { from: injectKey as string, default: { value: defaultValue } } };
}

/**
 * This function returns the computed configuration for bypass the `value` of the provide
 * of {@link XProvide}. This will be used to override the property decorated with {@link XInject}
 * with the computed.
 *
 * @param computedKey - The key used for the computed.
 * @param privateComponentKey - The "private" component property where the value is actually
 * injected.
 *
 * @returns The computed config to assign/merge with the component options.
 */
function getComputedProperty(
  computedKey: string,
  privateComponentKey: string
): ComponentOptions<Vue>['computed'] {
  return {
    [computedKey]: function (): unknown {
      return (this as unknown as Record<string, { value: unknown }>)[privateComponentKey].value;
    }
  };
}

/**
 * Type guard to check if a provide configuration is a function.
 *
 * @param provide - The provide configuration.
 * @returns A boolean indicating if the passed provide is a function.
 */
function isProvideFunction(
  provide: ComponentOptions<Vue>['provide']
): provide is (this: Vue) => ProvideObjectConfig {
  return typeof provide === 'function';
}
