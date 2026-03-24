export const platformIdentifierResultsResponse = {
  catalog: {
    content: [
      {
        __name: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
        __images: ['https://assets.empathy.co/images-demo/12345.jpg'],
        score: 1.5,
        tagging: {
          add2cart:
            'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart?q=12345&lang=en&scope=desktop&title=Xoxo+Women+Maroon+Pure+Georgette+Solid+Ready-to-wear+Saree&productId=12345-U&position=1&page=1&follow=false&origin=search_box%3Anone&filtered=false&spellcheck=false',
          checkout:
            'https://api.staging.empathy.co/tagging/v1/track/empathy/checkout?q=12345&lang=en&scope=desktop&title=Xoxo+Women+Maroon+Pure+Georgette+Solid+Ready-to-wear+Saree&productId=12345-U&position=1&page=1&follow=false&origin=search_box%3Anone&filtered=false&spellcheck=false',
          click:
            'https://api.staging.empathy.co/tagging/v1/track/empathy/click?q=12345&lang=en&scope=desktop&title=Xoxo+Women+Maroon+Pure+Georgette+Solid+Ready-to-wear+Saree&productId=12345-U&position=1&page=1&follow=false&origin=search_box%3Anone&filtered=false&spellcheck=false',
          displayClick:
            'https://api.staging.empathy.co/tagging/v1/track/empathy/displayClick?q=12345&lang=en&scope=desktop&title=Xoxo+Women+Maroon+Pure+Georgette+Solid+Ready-to-wear+Saree&productId=12345-U&position=1&page=1&follow=false&origin=search_box%3Anone&filtered=false&spellcheck=false',
        },
        __id: '12345-U',
        __externalId: '12345-U',
        groupId: '12345',
        __prices: {
          current: {
            value: 10,
          },
        },
      },
    ],
    tagging: {
      query:
        'https://api.staging.empathy.co/tagging/v1/track/empathy/query?q=12345&lang=en&scope=desktop&page=1&origin=search_box%3Anone&filtered=false&spellcheck=false',
    },
  },
}

export const identifierResultsResponse = {
  results: [
    {
      id: '12345-U',
      identifier: {
        value: '12345-U',
      },
      images: ['https://assets.empathy.co/images-demo/12345.jpg'],
      isWishlisted: false,
      modelName: 'Result',
      name: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
      price: {
        value: 10,
        originalValue: 10,
        hasDiscount: false,
      },
      rating: {
        value: null,
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
            title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
          },
          url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart',
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
            title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
          },
          url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/checkout',
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
            title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
          },
          url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/click',
        },
        displayClick: {
          params: {
            displayId: '12345',
            filtered: 'false',
            follow: false,
            lang: 'en',
            origin: 'search_box:none',
            page: '1',
            position: '1',
            productId: '12345-U',
            scope: 'desktop',
            spellcheck: 'false',
            title: 'Xoxo Women Maroon Pure Georgette Solid Ready-to-wear Saree',
          },
          url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/displayClick',
        },
      },
      type: 'Default',
    },
  ],
}
