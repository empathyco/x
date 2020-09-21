import { interfaces } from 'inversify';
import { Dictionary, Newable } from '../../types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type BindingDictionary = Dictionary<Binding>;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type Binding = ClassBinding | ParentBinding | AncestorBinding | ConstantBinding | DynamicBinding;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type ContextualBinding = ParentBinding | AncestorBinding;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type ClassBinding = Newable<any> | Newable<any>[];

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface ParentBinding {
  default?: ClassBinding;
  whenInjectedInto: Dictionary<ClassBinding>;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface AncestorBinding {
  default?: ClassBinding;
  whenAnyAncestorIs: Dictionary<ClassBinding>;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type ConstantBinding<T = any> = SimpleConstantBinding<T> | ParentConstantBinding<T> | AncestorConstantBinding<T>;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface SimpleConstantBinding<T = any> {
  toConstant: T;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface ParentConstantBinding<T = any> {
  toConstantWhenInjectedInto: Dictionary<T>;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface AncestorConstantBinding<T = any> {
  toConstantWhenAnyAncestorIs: Dictionary<T>;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface DynamicBinding<T = any> {
  toDynamic: (context: interfaces.Context) => T;
}
