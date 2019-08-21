import { Tagging } from '@empathy/search-types';
import { injectable } from 'inversify';
import { Dictionary } from '../../../types';
import { ResponseMapper } from '../../empathy-adapter.types';
import { Logger } from '../../logger';

@injectable()
export class EmpathyTaggingMapper implements ResponseMapper<string, Tagging> {
  private readonly logger = Logger.child('EmpathyTaggingMapper');

  map(taggingUrl: string, tagging: Tagging): Tagging {
    try {
      const { url, params } = this.extractUrlParameters(taggingUrl);
      Object.assign(tagging, { url, params });
    } catch (e) {
      this.logger.warn('[EmpathyBrokerTaggingMapper]', 'Invalid tagging url: ', taggingUrl);
    }

    return tagging;
  }

  private extractUrlParameters(taggingUrl: string): Dictionary<any> {
    const params: Dictionary<any> = {};
    const url = new URL(taggingUrl);
    url.searchParams.forEach((value, key) => {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else if (params[key]) {
        params[key] = [params[key], value];
      } else {
        params[key] = value;
      }
    });
    params.follow = false;
    return {
      url: `${ url.origin }${ url.pathname }`,
      params
    };
  }
}
