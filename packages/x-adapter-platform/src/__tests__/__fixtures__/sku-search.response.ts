export const skuSearchResponse = {
  results: [
    {
      id: '12345-U',
      identifier: {
        value: '12345-U'
      },
      images: ['https://assets.empathy.co/images-demo/12345.jpg'],
      isWishlisted: false,
      modelName: 'Result',
      name: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
      price: {
        hasDiscount: false
      },
      rating: {
        value: null
      },
      tagging: {
        add2cart: {
          params: {
            filtered: 'false',
            follow: false,
            lang: 'en',
            origin: 'search_box:none',
            page: '1',
            position: '1',
            productId: '12345-U',
            q: '12345',
            scope: 'desktop',
            spellcheck: 'false',
            title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree'
          },
          url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart'
        },
        checkout: {
          params: {
            filtered: 'false',
            follow: false,
            lang: 'en',
            origin: 'search_box:none',
            page: '1',
            position: '1',
            productId: '12345-U',
            q: '12345',
            scope: 'desktop',
            spellcheck: 'false',
            title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree'
          },
          url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/checkout'
        },
        click: {
          params: {
            filtered: 'false',
            follow: false,
            lang: 'en',
            origin: 'search_box:none',
            page: '1',
            position: '1',
            productId: '12345-U',
            q: '12345',
            scope: 'desktop',
            spellcheck: 'false',
            title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree'
          },
          url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/click'
        }
      },
      type: 'Default'
    }
  ]
};
