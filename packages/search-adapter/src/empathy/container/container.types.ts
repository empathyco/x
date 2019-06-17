import { interfaces } from 'inversify';
import { Dictionary, Newable } from '../../utils/utils.types';

export type BindingDictionary = Dictionary<Binding>;
export type Binding = ClassBinding | ParentBinding | AncestorBinding | ConstantBinding | DynamicBinding;
export type ContextualBinding = ParentBinding | AncestorBinding;

export type ClassBinding = Newable<any> | Newable<any>[];

export interface ParentBinding {
  default?: ClassBinding;
  whenInjectedInto: Dictionary<ClassBinding>;
}

export interface AncestorBinding {
  default?: ClassBinding;
  whenAnyAncestorIs: Dictionary<ClassBinding>;
}

export type ConstantBinding<T = any> = SimpleConstantBinding<T> | ParentConstantBinding<T> | AncestorConstantBinding<T>;

export interface SimpleConstantBinding<T = any> {
  toConstant: T;
}

export interface ParentConstantBinding<T = any> {
  toConstantWhenInjectedInto: Dictionary<T>;
}

export interface AncestorConstantBinding<T = any> {
  toConstantWhenAnyAncestorIs: Dictionary<T>;
}

export interface DynamicBinding<T = any> {
  toDynamic: (context: interfaces.Context) => T;
}
