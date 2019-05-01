import { Container } from 'inversify';
import { EntityNames, FeatureNames } from '../../models';
import { EmpathyAdapterConfig } from '../config/empathy-adapter-config.types';
import { container } from '../container/empathy-adapter.bindings';
import { EmpathyAdapter, Mapper } from '../empathy-adapter.types';

interface AddMapperOptions {
  forEntity?: EntityNames;
  forFeature?: FeatureNames;
}

export class EmpathyAdapterBuilder {
  dependenciesTree = DEFAULT_DEPENDENCIES_TREE;

  build(config: EmpathyAdapterConfig): EmpathyAdapter {

  }

  configureContainer(configurator: (container: Container) => void) {
    this.configurator(container);
  }

  addMapper<Entity>(mapper: Mapper<Entity>, { forEntity, forFeature }: AddMapperOptions) {

  }

  setMapper<Entity>(mapper: Mapper<Entity>, { forEntity, forFeature }: AddMapperOptions) {

  }
}

