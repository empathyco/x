import { Container } from 'inversify';
import { BindingTree } from './container.types';

export function parseConfig(bindingTree: BindingTree,
  container: Container = new Container({ defaultScope: 'Singleton' })): Container {
  Object.entries(bindingTree).forEach(([key, config]) => {
    if (config.dependencies) {
      const child = container.createChild({ defaultScope: 'Singleton' });
      child.bind(key).to(config.to);
      parseConfig(config.dependencies, child);
    } else {
      container.bind(key).to(config.to);
    }
  });
  return container;
}
