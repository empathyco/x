import { injectable, multiInject } from 'inversify';
import { DEPENDENCIES } from '../container/container.const';
import { ResponseMapper } from '../empathy-adapter.types';
import { EntityNames } from '../entities.types';

@injectable()
export class ResponseMappers implements Record<EntityNames, ResponseMapper[]> {
  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.banners) public readonly banners: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.facets) public readonly  facets: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.nextQueries) public readonly nextQueries: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.partialResults) public readonly partialResults: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.promoteds) public readonly promoteds: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.queryTagging) public readonly queryTagging: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.redirections) public readonly redirections: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.relatedTags) public readonly relatedTags: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.results) public readonly results: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.spellcheck) public readonly spellcheck: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.suggestions) public readonly suggestions: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.totalResults) public readonly totalResults: ResponseMapper[],
    @multiInject(DEPENDENCIES.ResponseMappers.totalResults) public readonly filters: ResponseMapper[]
  ) {}
}
