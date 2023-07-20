import {
  FacetConfig,
  facetSchema,
  getFacetConfig,
  PlatformAdapter,
  platformAdapter,
  PlatformFacet,
  PlatformFacetType
} from '@empathyco/x-adapter-platform';
import { NumberRangeFacet } from '@empathyco/x-types';
import { e2eAdapter } from '../adapter/e2e-adapter';

export const adapterConfig = {
  e2e: 'Cypress' in window ? true : false
};

export const adapter = new Proxy(platformAdapter, {
  get: (obj: PlatformAdapter, prop: keyof PlatformAdapter) =>
    adapterConfig.e2e ? e2eAdapter[prop] : obj[prop]
});

const getFacetConfigWithEditable = (facetId: string, type: PlatformFacetType): FacetConfig =>
  facetId === 'salePrice' ? getFacetConfig('editable-range') : getFacetConfig(type);

facetSchema.$override<PlatformFacet, Partial<NumberRangeFacet>>({
  modelName: ({ type, facet }) => getFacetConfigWithEditable(facet, type).modelName as any,
  filters: {
    $path: 'values',
    $subSchema: ({ type, facet }) => getFacetConfigWithEditable(facet, type).schema
  }
});
