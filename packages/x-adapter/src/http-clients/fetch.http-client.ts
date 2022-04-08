import { Dictionary } from '@empathyco/x-utils';
import { HttpClient } from '../types/http-client.types';
import { buildUrl, toJson } from './utils';

const requests: Dictionary<AbortController> = {};

export const fetchHttpClient: HttpClient = (
  endpoint,
  { id = endpoint, parameters, properties } = {}
) => {
  const url = buildUrl(endpoint, parameters);
  requests[id]?.abort();
  requests[id] = new AbortController();

  return fetch(url, { ...properties, signal: requests[id].signal }).then(toJson);
};
