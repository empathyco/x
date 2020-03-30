import Vue, { ComponentOptions } from 'vue';
import { createDecorator } from 'vue-class-component';
import { AnyFunction, DecoratorFor } from '../utils';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { ExtractGetters, ExtractState, XModuleName } from '../x-modules/x-modules.types';

/**
 * Generates a computed property which returns the selected state.
 *
 * The decorated property needs to be public for type inference to work.
 *
 * @param module - The {@link XModuleName} of the getter.
 * @param path - The state path.
 * @returns Decorator with the state properties of the module.
 * @public
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
 * @public
 */
export function Getter<Module extends XModuleName, GetterName extends keyof ExtractGetters<Module>>(
  module: Module,
  getter: GetterName
): DecoratorFor<ExtractGetters<Module>[GetterName]> {
  return createDecorator((options: ComponentOptions<Vue>, key: string) => {
    if (!options.computed) {
      options.computed = {};
    }
    const getterPath = `x/${module}/${getter}`;
    Object.assign(options.computed, {
      [key]() {
        return this.$store.getters[getterPath];
      }
    } as ThisType<Vue>);
  });
}

/**
 * Creates a subscription to an {@link XEvent} and un-subscribes on the beforeDestroy hook.
 *
 * @remarks
 * The decorated property needs to be public for type inference to work.
 *
 * @param event - The {@link XEvent}.
 * @returns Decorator that creates a subscription to an {@link XEvent} and un-subscribes on the
 * beforeDestroy hook.
 * @public
 */
export function XOn<Event extends XEvent>(
  event: Event
): DecoratorFor<(payload: XEventPayload<Event>) => void> {
  return createDecorator((options, key) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalCreated = options.created;
    Object.assign(options, {
      created() {
        originalCreated?.apply(this);
        const callback: AnyFunction = (this as any)[key]; // `this` isn't correctly typed here
        const subscription = this.$x.on(event).subscribe(callback);
        this.$on('hook:beforeDestroy', () => subscription.unsubscribe()); // Using Vue
        // bus to subscribe to the lifecycle hook 'beforeDestroy' instead of 'capturing' the
        // original component's 'beforeDestroy' method to override it plus calling
        // originalBeforeDestroy.apply(this) to preserve the existing original hook functionality
      }
    } as ThisType<Vue>);
  });
}
