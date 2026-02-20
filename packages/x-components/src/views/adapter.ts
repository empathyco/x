/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-unsafe-assignment */
import type { PlatformAdapter } from '@empathyco/x-adapter-platform'
import { platformAdapter, resultSchema } from '@empathyco/x-adapter-platform'
import { e2eAdapter } from '../adapter/e2e-adapter'

export const adapterConfig = {
  e2e: 'Cypress' in window,
}

export const adapter = new Proxy(platformAdapter, {
  get: (obj: PlatformAdapter, prop: keyof PlatformAdapter) =>
    adapterConfig.e2e ? e2eAdapter[prop] : obj[prop],
})

resultSchema.$override<any, Partial<any>>({
  availability: 'availability',
  description: 'description',
  collection: 'collection',
  brand: 'brand',
  encuadernation: 'encuadernation',
  isSigned: 'isSigned',
  isLocalProduct: 'isLocalProduct',
  freeShipping: 'freeShipping',
  externalScore: ({ externalScore }) => Number(externalScore),
  externalVotes: 'externalVotes',
  isNovelty: 'isNovelty',
  productType: 'productType',
  identifier: {
    value: 'isbn',
  },
  price: ({ price: rawPrices, availability }) => {
    if (availability === 'descatalogado' || availability === 'agotado') {
      return undefined
    }
    if (rawPrices) {
      return {
        value: rawPrices.current,
        originalValue: rawPrices.previous ?? rawPrices.current,
        futureValue: 0,
        hasDiscount: rawPrices.current < (rawPrices.previous ?? rawPrices.current),
      }
    }
    return undefined
  },
})
