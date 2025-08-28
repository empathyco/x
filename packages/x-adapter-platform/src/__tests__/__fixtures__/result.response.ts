import type { Result } from '@empathyco/x-types'
import type { PlatformResult } from '../../types'

export const platformResult: PlatformResult = {
  __id: '31335-U',
  __externalId: '31335-U',
  __name: 'Locomotive Men Washed Blue Jeans',
  __url: 'https://assets.empathy.co/images-demo/31335.jpg',
  __images: ['https://assets.empathy.co/images-demo/31335.jpg'],
  __prices: {
    current: {
      value: 10,
    },
  },
  tagging: {
    add2cart: 'https://add2carttagging/',
    checkout: 'https://checkouttagging/',
    click: 'https://clicktagging/',
    displayClick: 'https://displayclicktagging/',
  },
}

export const result: Result = {
  id: platformResult.__id,
  identifier: {
    value: platformResult.__externalId,
  },
  images: platformResult.__images,
  isWishlisted: false,
  modelName: 'Result',
  name: platformResult.__name,
  price: {
    hasDiscount: false,
    originalValue: platformResult.__prices.current.value,
    futureValue: platformResult.__prices.current.value,
    value: platformResult.__prices.current.value,
  },
  rating: {
    value: null,
  },
  tagging: {
    add2cart: {
      params: {
        follow: false,
      },
      url: platformResult.tagging.add2cart,
    },
    checkout: {
      params: {
        follow: false,
      },
      url: platformResult.tagging.checkout,
    },
    click: {
      params: {
        follow: false,
      },
      url: platformResult.tagging.click,
    },
    displayClick: {
      params: {
        displayId: 'no_query',
        follow: false,
      },
      url: platformResult.tagging.displayClick,
    },
  },
  type: 'Default',
  url: platformResult.__url,
}
