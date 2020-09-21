/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface EndpointsService {
  buildUrl(rawUrl: string): string;
}
