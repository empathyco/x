import { inject, injectable } from 'inversify';
import { QueryableRequest } from '../../../../types';
import { EmpathyAdapterConfig, QueryConfig } from '../../../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../../../container/container.const';
import { RequestMapper } from '../../../empathy-adapter.types';

@injectable()
export class EmpathyRequestQueryMapper implements RequestMapper<QueryableRequest, string> {
  private readonly queryConfig: QueryConfig;

  constructor(@inject(DEPENDENCIES.config) config: EmpathyAdapterConfig) {
    this.queryConfig = config.mappings.query;
  }

  map(_: QueryableRequest, query: string): string {
    return this.normalizeQuery(query);
  }

  protected normalizeQuery(query: string): string {
    return query
      .split(/\s+/)
      .slice(0, this.queryConfig.maxWords)
      .join(' ')
      .slice(0, this.queryConfig.maxLength);
  }
}
