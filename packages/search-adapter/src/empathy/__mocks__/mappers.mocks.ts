import { Suggestion } from '@empathyco/x-types-old';
import { inject, injectable } from 'inversify';
import { Dictionary } from '../../types';
import { FeatureConfig } from '../config/empathy-adapter-config.types';
import { ResponseMapper } from '../empathy-adapter.types';
import { HttpClient } from '../http-clients/http-client.types';

export const featureConfig: FeatureConfig<'suggestions'> = {
  cacheTTLInMinutes: 0,
  endpoint: 'endpoint',
  responsePaths: {
    suggestions: 'data.suggestions'
  }
};

export interface FromRequest {
  a: string;
  b: string;
}

export interface ToRequest {
  a1: string;
  b1: string;
}

export type SimpleSuggestion = string;

@injectable()
export class RequestMapper1 implements ResponseMapper<FromRequest, ToRequest> {
  map(from: FromRequest, to: ToRequest): ToRequest {
    return Object.assign(to, {
      a1: from.a
    });
  }
}

@injectable()
export class RequestMapper2 implements ResponseMapper<FromRequest, ToRequest> {
  map(from: FromRequest, to: ToRequest): ToRequest {
    return Object.assign(to, {
      b1: from.b
    });
  }
}

@injectable()
export class StaticHttpClient implements HttpClient {
  constructor(
    @inject('MockedResponse') public mockedResponse: Dictionary<any>
  ) {}

  get(_url: string, _params?: Dictionary<any>): Promise<any> {
    return Promise.resolve(this.mockedResponse);
  }
}

@injectable()
export class SuggestionMapper1 implements ResponseMapper<SimpleSuggestion, Suggestion> {
  map(suggestion: SimpleSuggestion, to: Suggestion): Suggestion {
    return Object.assign(to, {
      facets: [],
      query: suggestion,
      key: suggestion
    });
  }
}

@injectable()
export class SuggestionMapper2 implements ResponseMapper<SimpleSuggestion, Suggestion> {
  map(_from: SimpleSuggestion, to: Suggestion): Suggestion {
    return Object.assign(to, {
      modelName: 'QuerySuggestion'
    });
  }
}

@injectable()
export class SuggestionAsStringMapper implements ResponseMapper<SimpleSuggestion, string> {
  map(from: SimpleSuggestion): string {
    return from;
  }
}
