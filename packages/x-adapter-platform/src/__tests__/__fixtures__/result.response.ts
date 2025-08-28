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
    add2cart: 'https://add2cartTagging',
    checkout: 'https://checkoutTagging',
    click: 'https://clickTagging',
    displayClick: 'https://displayClickTagging',
  },
}

export const result: Result = {
  id: '31335-U',
  identifier: {
    value: '31335-U',
  },
  images: ['https://assets.empathy.co/images-demo/31335.jpg'],
  isWishlisted: false,
  modelName: 'Result',
  name: 'Locomotive Men Washed Blue Jeans',
  price: {
    hasDiscount: false,
    originalValue: 10,
    futureValue: 10,
    value: 10,
  },
  rating: {
    value: null,
  },
  tagging: {
    add2cart: {
      params: {
        follow: false,
      },
      url: 'https://add2carttagging/',
    },
    checkout: {
      params: {
        follow: false,
      },
      url: 'https://checkouttagging/',
    },
    click: {
      params: {
        follow: false,
      },
      url: 'https://clicktagging/',
    },
    displayClick: {
      params: {
        displayId: 'no_query',
        follow: false,
      },
      url: 'https://displayclicktagging/',
    },
  },
  type: 'Default',
  url: 'https://assets.empathy.co/images-demo/31335.jpg',
}
