import { inject, injectable, multiInject, optional } from 'inversify';
import { DEPENDENCIES } from '../container/container.const';
import { BeforeRequest, BeforeResponseTransform, RequestMapper, Requestor, ResponseTransformed } from '../empathy-adapter.types';
import { EmpathySimpleRequestMapper } from '../mappers/request/empathy-simple-request.mapper';
import { ResponseMappers } from '../mappers/response.mappers';
import { EmpathyResultMapper } from '../mappers/response/results/empathy-result.mapper';

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
