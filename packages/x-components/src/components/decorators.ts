import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import Vue, { ComponentOptions } from 'vue';
import { createDecorator } from 'vue-class-component';
import { getGetterPath } from '../plugins/x-plugin.mixin';
import { AnyFunction, DecoratorFor } from '../utils';
import { XEvent, XEventPayload } from '../wiring/events.types';
import { WireMetadata } from '../wiring/wiring.types';
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
    const getterPath = getGetterPath(module, getter);
    Object.assign(options.computed, {
      [key]() {
        return this.$store.getters[getterPath];
      }
    } as ThisType<Vue>);
  });
}

/**
 * Creates a subscription to an {@link XEvent}, an array of {@link XEvent} or a component property (
 * reacting to its changes via a watcher) filtering out the passed metadata, if any, and
 * un-subscribes on the beforeDestroy hook.
 *
 * @remarks
 * The decorated property needs to be public for type inference to work.
 *
 * @param xEvent - The {@link XEvent}, an array of {@link XEvent} or a component property.
 * @param metadataFilteringOptions - The {@link WireMetadata} options to filter out a callback
 * execution.
 * @returns Decorator that creates a subscription to an {@link XEvent} and un-subscribes on the
 * beforeDestroy hook.
 * @public
 */
export function XOn<Event extends XEvent>(
  xEvent: Event | Event[] | ((component: Vue) => Event | Event[]),
  metadataFilteringOptions: Partial<WireMetadata> = {}
): DecoratorFor<(payload: XEventPayload<Event>, metadata: WireMetadata) => void> {
  return createDecorator((options, key) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalCreated = options.created;
    Object.assign(options, {
      created() {
        originalCreated?.apply(this);
        const componentCreateSubscription = createSubscription.bind(this);
        const subscriptionMetadata: SubscriptionMetadata<Event> = {
          event: [],
          callback: (this as any)[key], // `this` isn't correctly typed here
          metadataFilteringOptions
        };

        let subscription: Subscription;
        if (typeof xEvent === 'function') {
          this.$watch(
            () => xEvent(this),
            newEvents => {
              subscription?.unsubscribe();
              subscriptionMetadata.event = newEvents;
              subscription = componentCreateSubscription(subscriptionMetadata);
            },
            { immediate: true }
          );
        } else {
          subscriptionMetadata.event = xEvent;
          subscription = componentCreateSubscription(subscriptionMetadata);
        }

        this.$on('hook:beforeDestroy', () => subscription.unsubscribe()); // Using Vue
        // bus to subscribe to the lifecycle hook 'beforeDestroy' instead of 'capturing' the
        // original component's 'beforeDestroy' method to override it plus calling
        // originalBeforeDestroy.apply(this) to preserve the existing original hook functionality
      }
    } as ThisType<Vue>);
  });
}

/**
 * Create a subscription for the given events executing the passed callback and filtering out based
 * on the passed metadata options.
 *
 * @param this - The vue component.
 * @param subscriptionMetadata - The {@link SubscriptionMetadata}.
 * @returns A
 * {@link https://www.learnrxjs.io/learn-rxjs/concepts/rxjs-primer#subscription | subscription}.
 * @internal
 */
function createSubscription<Event extends XEvent>(
  this: Vue,
  subscriptionMetadata: SubscriptionMetadata<Event>
): Subscription {
  const { event, callback, metadataFilteringOptions } = subscriptionMetadata;
  const eventArray = Array.isArray(event) ? event : [event];
  const subscription = new Subscription();
  eventArray.forEach(xEvent => {
    subscription.add(
      this.$x
        .on(xEvent, true)
        .pipe(filter(({ metadata }) => filterMetadataOptions(metadataFilteringOptions, metadata)))
        .subscribe(({ eventPayload, metadata }) => callback(eventPayload, metadata))
    );
  });
  return subscription;
}

/**
 * Checks if the metadata options passed to the decorator match the metadata of the emitted event.
 *
 * @param filteringOptions - The decorator options.
 * @param eventOptions - The emitted event metadata.
 * @returns True if options are empty or match the metadata.
 * @internal
 */
function filterMetadataOptions<WireMetadataKey extends keyof WireMetadata>(
  filteringOptions: Partial<WireMetadata>,
  eventOptions: WireMetadata
): boolean {
  return (Object.keys(filteringOptions) as WireMetadataKey[])
    .filter(key => filteringOptions[key] !== undefined)
    .every(key => filteringOptions[key] === eventOptions[key]);
}

/**
 * The subscription metadata containing an/a list of {@link XEvent}, the callback function to
 * execute and the metadataOptions to filter out the execution of the callback.
 *
 * @internal
 */
interface SubscriptionMetadata<Event extends XEvent> {
  /**
   * An {@link XEvent} or a list of them.
   */
  event: Event | Event[];
  /**
   * A callback function to execute in the subscription.
   */
  callback: AnyFunction;
  /**
   * The metadataFilteringOptions to filter out the execution of the callback.
   */
  metadataFilteringOptions: Partial<WireMetadata>;
}
