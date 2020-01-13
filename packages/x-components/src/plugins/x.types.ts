import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { PropsWithType } from '../utils';
import { XEvent, XEventPayload, XEventsTypes } from '../wiring/events.types';
import { Wiring, WiringOptions } from '../wiring/wiring.types';

/**
 * {@link XPlugin } installation options
 */
export interface XPluginOptions {
  /** Override the default configuration of the {@link XModule | XModules} */
  xModules?: XModulesOptions
  // TODO Add store
}

/**
 * Options for overriding the default XModules configuration
 */
export type XModulesOptions = { [Name in XModuleName]?: XModuleOptions<Name> }

/**
 * Options for overriding a default XModule configuration
 * @param M The module name to modify its default configuration
 */
export interface XModuleOptions<M extends XModuleName> {
  /** The options to override the default wiring configuration for the module */
  wiring: WiringOptions<any> // TODO Implement type safe wiring modification
}

export type XModuleName = string; // TODO Implement type

/**
 * A group of a wiring configuration, a store module, and side effects
 * @param S The store module state type
 * @param W The wiring concrete type
 */
export interface XModule<S, W extends Partial<Wiring>> {
  /** A unique name that identifies this XModule */
  name: XModuleName;
  /** The wiring associated to this module. It must only access to the store module of this XModule */
  wiring: W;
  // TODO Implement module, and sideEffect properties
}

/**
 * Alias for any XModule
 */
export type AnyXModule = XModule<any, any>;

/**
 * The XComponentAPI exposes access to the {@link XBus} to the components
 */
export interface XComponentAPI extends XBus {}

/**
 * The events bus that allows emitting and subscribing to {@link XEventsTypes}
 */
export interface XBus {
  /**
   * Emits an event with the `void` type associated as payload
   * @param event The event name
   */
  emit(event: PropsWithType<XEventsTypes, void>): void;
  /**
   * Emits an event with a non-void payload
   * @param event The event name
   * @param payload The payload of the event
   */
  emit<E extends XEvent>(event: E, payload: XEventPayload<E>): void;
  /**
   * Retrieves the observable for an event
   * @param event The event to retrieve an observable for
   */
  on<E extends XEvent>(event: E): Observable<XEventPayload<E>>;
}

export type Emitters = { [E in XEvent]?: Subject<XEventPayload<E>> };
