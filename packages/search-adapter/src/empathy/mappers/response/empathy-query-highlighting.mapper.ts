import { injectable } from 'inversify';
import { ResponseMapper, ResponseMapperContext } from '../../empathy-adapter.types';

@injectable()
export class EmpathyQueryHighlightingMapper implements ResponseMapper<string, string> {
  private static readonly CLEAN_QUERY_REGEX = /[^\w\s.,:;\-_\/\\]/g;

  map(rawString: string, targetString: string, context: Readonly<ResponseMapperContext>): string {
    return context.rawRequest.query
      ? rawString.replace(this.getQueryRegex(context), `<strong class="${ context.queryHighlightingClass }">$1</strong>`)
      : targetString;
  }

  private getQueryRegex({ queryRegex, rawRequest }: Readonly<ResponseMapperContext>): RegExp {
    if (!queryRegex) {
      const normalizedQuery = this.normalizeQuery(rawRequest.query);
      queryRegex = new RegExp(`(${ normalizedQuery })`, 'i');
    }
    return queryRegex;
  }

  private normalizeQuery(query: string): string {
    return String.prototype.normalize
      ? query
        .trim()
        .normalize('NFD')
        .replace(EmpathyQueryHighlightingMapper.CLEAN_QUERY_REGEX, '')
      : query
        .trim();
  }
}
