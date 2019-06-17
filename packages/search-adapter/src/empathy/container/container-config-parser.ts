import { Container } from 'inversify';
import { Logger } from '../logger';
import {
  AncestorBinding,
  AncestorConstantBinding,
  Binding,
  BindingDictionary,
  ClassBinding,
  ContextualBinding,
  DynamicBinding,
  ParentBinding,
  ParentConstantBinding,
  SimpleConstantBinding
} from './container.types';

export class ContainerConfigParser {
  private readonly logger = Logger.child('ContainerConfigParser');

  constructor(
    private readonly config: BindingDictionary,
    private readonly container: Container = new Container()
  ) {}

  parse(): Container {
    Object.entries(this.config).forEach(([key, binding]) => {
      if (this.isClassBinding(binding)) {
        this.bind(key, binding);
      } else if (this.isSimpleConstantBinding(binding)) {
        this.bindAsConstant(key, binding.toConstant);
      } else if (this.isParentConstantBinding(binding)) {
        this.bindAsConstantToParent(key, binding);
      } else if (this.isAncestorConstantBinding(binding)) {
        this.bindAsConstantToAncestor(key, binding);
      } else if (this.isDynamicBinding(binding)) {
        this.bindAsDynamic(key, binding);
      } else if (this.isParentBinding(binding)) {
        this.bindToParent(key, binding);
      } else if (this.isAncestorBinding(binding)) {
        this.bindToAncestor(key, binding);
      } else {
        this.logger.warn('Unable to parse dependency with key "', key, '" and value: ', binding);
      }
    });
    return this.container;
  }

  private bind(key: string, binding: ClassBinding) {
    const bindings = Array.isArray(binding)
      ? binding.map(impl => this.container.bind(key).to(impl))
      : [this.container.bind(key).to(binding)];
    return {
      whenInjectedInto(parent: string) { bindings.forEach(partialBinding => partialBinding.whenInjectedInto(parent)); },
      whenAnyAncestorIs(ancestor: string) { bindings.forEach(partialBinding => partialBinding.whenAnyAncestorIs(ancestor)); }
    };
  }

  private bindAsConstant(key: string, constant: any) {
    return this.container.bind(key).toConstantValue(constant);
  }

  private bindAsConstantToParent(key: string, binding: ParentConstantBinding) {
    Object.entries(binding.toConstantWhenInjectedInto).forEach(([parent, constant]) =>
      this.bindAsConstant(key, constant).whenInjectedInto(parent)
    );
  }

  private bindAsConstantToAncestor(key: string, binding: AncestorConstantBinding) {
    Object.entries(binding.toConstantWhenAnyAncestorIs).forEach(([parent, constant]) =>
      this.bindAsConstant(key, constant).whenAnyAncestorIs(parent)
    );
  }

  private bindAsDynamic(key: string, binding: DynamicBinding) {
    this.container.bind(key).toDynamicValue(binding.toDynamic);
  }

  private bindToAncestor(key: string, binding: AncestorBinding) {
    if (binding.default) {
      this.bind(key, binding.default);
    }
    Object.entries(binding.whenAnyAncestorIs)
      .forEach(([parent, contextualBinding]) => this.bind(key, contextualBinding).whenAnyAncestorIs(parent));
  }

  private bindToParent(key: string, binding: ParentBinding) {
    if (binding.default) {
      this.bind(key, binding.default);
    }
    Object.entries(binding.whenInjectedInto)
      .forEach(([parent, contextualBinding]) => this.bind(key, contextualBinding).whenInjectedInto(parent));
  }

  private isAncestorBinding(binding: ContextualBinding): binding is AncestorBinding {
    return (binding as AncestorBinding).whenAnyAncestorIs !== undefined;
  }

  private isClassBinding(binding: Binding): binding is ClassBinding {
    return Array.isArray(binding) || typeof binding === 'function';
  }

  private isSimpleConstantBinding(binding: Binding): binding is SimpleConstantBinding {
    return (binding as SimpleConstantBinding).toConstant !== undefined;
  }

  private isParentConstantBinding(binding: Binding): binding is ParentConstantBinding {
    return (binding as ParentConstantBinding).toConstantWhenInjectedInto !== undefined;
  }

  private isAncestorConstantBinding(binding: Binding): binding is AncestorConstantBinding {
    return (binding as AncestorConstantBinding).toConstantWhenAnyAncestorIs !== undefined;
  }

  private isDynamicBinding(binding: Binding): binding is DynamicBinding {
    return (binding as DynamicBinding).toDynamic !== undefined;
  }

  private isParentBinding(binding: ContextualBinding): binding is ParentBinding {
    return (binding as ParentBinding).whenInjectedInto !== undefined;
  }
}
