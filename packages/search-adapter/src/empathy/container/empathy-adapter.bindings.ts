import { Container } from 'inversify';
import { FetchHttpClient } from '../http-clients/fetch-http-client';
import { EmpathyResultMapper } from '../mappers/empathy-result.mapper';
import { ObjectRequestor } from '../requestors/object.requestor';
import { BindingTree } from './container.types';
import { DEPENDENCIES } from './empathy-adapter-container.const';

export const container = new Container({ defaultScope: 'Singleton' });

export const DEFAULT_DEPENDENCIES_TREE: BindingTree = {
  [DEPENDENCIES.httpClient]: {
    to: FetchHttpClient
  },
  [DEPENDENCIES.Requestors.nextQueries]: {
    to: ObjectRequestor
  },
  [DEPENDENCIES.Requestors.recommendations]: {
    to: ObjectRequestor,
    dependencies: {
      [DEPENDENCIES.Mappers.results]: { to: [EmpathyResultMapper, MyCustomResultMapper] }
    }
  },
  [DEPENDENCIES.Requestors.search]: {
    to: ObjectRequestor,
    dependencies: {}
  },
  [DEPENDENCIES.Requestors.relatedTags]: {
    to: ObjectRequestor,
    dependencies: {}
  },
  [DEPENDENCIES.Requestors.searchById]: {
    to: ObjectRequestor,
    dependencies: {}
  },
  [DEPENDENCIES.Requestors.suggestions]: {
    to: ObjectRequestor,
    dependencies: {}
  },
  [DEPENDENCIES.Mappers.results]: {
    to: EmpathyResultMapper
  }
};

/*container.bind<MappersProvider>(EMPATHY_ADAPTER_SYMBOLS.Mapper)
 .toProvider((context: interfaces.Context) => (feature: string, entities: EntityNames[]) => {
 return Promise.resolve(entities.reduce((entityMappers, entity) => {
 entityMappers[entity] = context.container.get(MAPPERS[entity]).(REQUESTORS[feature]);
 return entityMappers;
 }, {} as Dictionary<Mapper<any, any>>));
 });
 */

