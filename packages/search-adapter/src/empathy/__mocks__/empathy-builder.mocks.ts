import { inject, injectable, multiInject, optional } from 'inversify';
import { DEPENDENCIES } from '../container/container.const';
import { BeforeRequest, BeforeResponseTransform, RequestMapper, Requestor, ResponseTransformed } from '../empathy-adapter.types';
import { EmpathyResultMapper, EmpathySimpleRequestMapper, ResponseMappers } from '../mappers';

@injectable()
export class CustomResultMapper extends EmpathyResultMapper {}

export class CustomRequestMapper extends EmpathySimpleRequestMapper {}

@injectable()
export class CustomRequestor implements Requestor {
  constructor(
    @inject(DEPENDENCIES.entityMappers) public mappers: ResponseMappers,
    @multiInject(DEPENDENCIES.requestMappers) public requestMappers: RequestMapper[],
    @optional() @multiInject(DEPENDENCIES.Hooks.beforeRequest) public beforeRequest: BeforeRequest[],
    @optional() @multiInject(DEPENDENCIES.Hooks.beforeResponseTransformed) public beforeResponseTransformed: BeforeResponseTransform[],
    @optional() @multiInject(DEPENDENCIES.Hooks.responseTransformed) public responseTransformed: ResponseTransformed[]
  ) {}

  request(): Promise<any> {
    return Promise.resolve('Hey');
  }
}
