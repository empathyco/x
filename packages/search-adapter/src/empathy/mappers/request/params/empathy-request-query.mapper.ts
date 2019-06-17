import { inject, injectable } from 'inversify';
import { EmpathyAdapterConfig, QueryConfig } from '../../../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../../../container/container.const';
import { RequestMapper } from '../../../empathy-adapter.types';

@injectable()
export class EmpathyRequestQueryMapper implements RequestMapper<string, string> {
  private readonly queryConfig: QueryConfig;

  constructor(@inject(DEPENDENCIES.config) config: EmpathyAdapterConfig) {
    this.queryConfig = config.mappings.query;
  }

  map(_rawQuery: string, query: string): string {
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
