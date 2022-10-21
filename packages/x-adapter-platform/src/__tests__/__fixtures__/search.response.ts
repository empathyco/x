import { PlatformSearchResponse } from '../../types/responses/search-response.model';

/* eslint-disable max-len */
export const platformSearchResponse = {
  catalog: {
    content: [
      {
        image: 'https://assets.empathy.co/images-demo/31335.jpg',
        tagging: {
          add2cart:
            'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart?q=jeans&lang=en&scope=desktop&title=Locomotive+Men+Washed+Blue+Jeans&productId=31335-U&position=1&page=1&url=https%3A%2F%2Fassets.empathy.co%2Fimages-demo%2F31335.jpg&follow=false&origin=url%3Aexternal&filtered=false&spellcheck=false',
          checkout:
            'https://api.staging.empathy.co/tagging/v1/track/empathy/checkout?q=jeans&lang=en&scope=desktop&title=Locomotive+Men+Washed+Blue+Jeans&productId=31335-U&position=1&page=1&url=https%3A%2F%2Fassets.empathy.co%2Fimages-demo%2F31335.jpg&follow=false&origin=url%3Aexternal&filtered=false&spellcheck=false',
          click:
            'https://api.staging.empathy.co/tagging/v1/track/empathy/click?q=jeans&lang=en&scope=desktop&title=Locomotive+Men+Washed+Blue+Jeans&productId=31335-U&position=1&page=1&url=https%3A%2F%2Fassets.empathy.co%2Fimages-demo%2F31335.jpg&follow=false&origin=url%3Aexternal&filtered=false&spellcheck=false'
        },
        gender: 'Men',
        color: 'Blue',
        year: '2012',
        categoryPaths: ['/Apparel|78d9b7366', '78d9b7366/Bottomwear|78d9b7366__8a4e61a33'],
        usage: 'Casual',
        groupId: '31335',
        type: 'Jeans',
        url: 'https://assets.empathy.co/images-demo/31335.jpg',
        _jobProperties: {
          jobId: 'c1aceb24-271b-4270-a684-edebc1f3afa9',
          _eb_date_: '2022-01-26T11:34:24.868Z'
        },
        categoryIds: ['78d9b7366', '78d9b7366__8a4e61a33'],
        size: 'U',
        price: 10,
        popularity: 2,
        name: 'Locomotive Men Washed Blue Jeans',
        season: 'Summer',
        id: '31335-U',
        categories: ['Apparel', 'Bottomwear'],
        indexMetrics: {
          generatedTime: '2022-01-26T11:34:24.744Z',
          readTime: '2022-01-26T11:34:24.744Z',
          transformedTime: '2022-01-26T11:34:29.636Z'
        }
      }
    ],
    numFound: 1,
    spellchecked: '',
    partials: [
      {
        term: 'shirt',
        numFound: 84,
        content: [
          {
            image: 'https://assets.empathy.co/images-demo/31335.jpg',
            tagging: {
              add2cart:
                'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart?q=jeans&lang=en&scope=desktop&title=Locomotive+Men+Washed+Blue+Jeans&productId=31335-U&position=1&page=1&url=https%3A%2F%2Fassets.empathy.co%2Fimages-demo%2F31335.jpg&follow=false&origin=url%3Aexternal&filtered=false&spellcheck=false',
              checkout:
                'https://api.staging.empathy.co/tagging/v1/track/empathy/checkout?q=jeans&lang=en&scope=desktop&title=Locomotive+Men+Washed+Blue+Jeans&productId=31335-U&position=1&page=1&url=https%3A%2F%2Fassets.empathy.co%2Fimages-demo%2F31335.jpg&follow=false&origin=url%3Aexternal&filtered=false&spellcheck=false',
              click:
                'https://api.staging.empathy.co/tagging/v1/track/empathy/click?q=jeans&lang=en&scope=desktop&title=Locomotive+Men+Washed+Blue+Jeans&productId=31335-U&position=1&page=1&url=https%3A%2F%2Fassets.empathy.co%2Fimages-demo%2F31335.jpg&follow=false&origin=url%3Aexternal&filtered=false&spellcheck=false'
            },
            gender: 'Men',
            color: 'Blue',
            year: '2012',
            categoryPaths: ['/Apparel|78d9b7366', '78d9b7366/Bottomwear|78d9b7366__8a4e61a33'],
            usage: 'Casual',
            groupId: '31335',
            type: 'Jeans',
            url: 'https://assets.empathy.co/images-demo/31335.jpg',
            _jobProperties: {
              jobId: 'c1aceb24-271b-4270-a684-edebc1f3afa9',
              _eb_date_: '2022-01-26T11:34:24.868Z'
            },
            categoryIds: ['78d9b7366', '78d9b7366__8a4e61a33'],
            size: 'U',
            price: 10,
            popularity: 2,
            name: 'Locomotive Men Washed Blue Jeans',
            season: 'Summer',
            id: '31335-U',
            categories: ['Apparel', 'Bottomwear'],
            indexMetrics: {
              generatedTime: '2022-01-26T11:34:24.744Z',
              readTime: '2022-01-26T11:34:24.744Z',
              transformedTime: '2022-01-26T11:34:29.636Z'
            }
          }
        ]
      }
    ],
    tagging: {
      query:
        'https://api.staging.empathy.co/tagging/v1/track/empathy/query?q=jeans&lang=en&scope=desktop&totalHits=686&page=1&origin=url%3Aexternal&filtered=true&spellcheck=false'
    },
    facets: [
      {
        facet: 'categoryPaths',
        type: 'hierarchical',
        values: [
          {
            id: '78d9b7366',
            value: 'Apparel',
            count: 736,
            filter: 'categoryIds:78d9b7366',
            children: {
              facet: 'categoryPaths_78d9b7366',
              type: 'hierarchical',
              values: [
                {
                  id: '78d9b7366__8a4e61a33',
                  value: 'Bottomwear',
                  count: 637,
                  filter: 'categoryIds:78d9b7366__8a4e61a33',
                  children: {
                    facet: 'categoryPaths_78d9b7366__8a4e61a33',
                    type: 'hierarchical',
                    values: [
                      {
                        id: '78d9b7366__8a4e61a33_aa',
                        value: 'Added',
                        count: 1,
                        filter: 'categoryIds:78d9b7366__8a4e61a33_aa',
                        children: {
                          facet: 'categoryPaths_78d9b7366__8a4e61a33_aa',
                          type: 'hierarchical',
                          values: [
                            {
                              id: '78d9b7366__8a4e61a33_aa_bb',
                              value: 'Added 2',
                              count: 1,
                              filter: 'categoryIds:78d9b7366__8a4e61a33_aa_bb'
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  id: '78d9b7366__e2f94a4ea',
                  value: 'Topwear',
                  count: 99,
                  filter: 'categoryIds:78d9b7366__e2f94a4ea'
                }
              ]
            }
          },
          {
            id: 'b08648dbd',
            value: 'Accessories',
            count: 43,
            filter: 'categoryIds:b08648dbd'
          },
          {
            id: 'ffc61e1e9',
            value: 'Personal Care',
            count: 9,
            filter: 'categoryIds:ffc61e1e9',
            children: {
              facet: 'categoryPaths_ffc61e1e9',
              type: 'hierarchical',
              values: [
                {
                  id: 'ffc61e1e9_aa',
                  value: 'Added',
                  count: 1,
                  filter: 'categoryIds:ffc61e1e9_aa'
                }
              ]
            }
          },
          {
            id: 'e5eef62d8',
            value: 'Footwear',
            count: 6,
            filter: 'categoryIds:e5eef62d8'
          }
        ]
      },
      {
        facet: 'price',
        type: 'range',
        values: [
          {
            id: '10.0-20.0',
            value: '10.0-20.0',
            count: 97,
            filter: 'price:10.0-20.0'
          },
          {
            id: '20.0-30.0',
            value: '20.0-30.0',
            count: 80,
            filter: 'price:20.0-30.0'
          },
          {
            id: '30.0-40.0',
            value: '30.0-40.0',
            count: 85,
            filter: 'price:30.0-40.0'
          },
          {
            id: '40.0-50.0',
            value: '40.0-50.0',
            count: 75,
            filter: 'price:40.0-50.0'
          },
          {
            id: '50.0-60.0',
            value: '50.0-60.0',
            count: 88,
            filter: 'price:50.0-60.0'
          },
          {
            id: '60.0-70.0',
            value: '60.0-70.0',
            count: 62,
            filter: 'price:60.0-70.0'
          },
          {
            id: '70.0-80.0',
            value: '70.0-80.0',
            count: 84,
            filter: 'price:70.0-80.0'
          },
          {
            id: '80.0-90.0',
            value: '80.0-90.0',
            count: 86,
            filter: 'price:80.0-90.0'
          },
          {
            id: '90.0-100.0',
            value: '90.0-100.0',
            count: 79,
            filter: 'price:90.0-100.0'
          }
        ]
      },
      {
        facet: 'gender',
        type: 'value',
        values: [
          {
            id: 'men',
            value: 'men',
            count: 421,
            filter: 'gender:men'
          },
          {
            id: 'women',
            value: 'women',
            count: 247,
            filter: 'gender:women'
          },
          {
            id: 'boys',
            value: 'boys',
            count: 35,
            filter: 'gender:boys'
          },
          {
            id: 'girls',
            value: 'girls',
            count: 28,
            filter: 'gender:girls'
          },
          {
            id: 'unisex',
            value: 'unisex',
            count: 5,
            filter: 'gender:unisex'
          }
        ]
      }
    ]
  },
  banner: {
    content: [
      {
        id: '61f9223221c06701c2f98c17',
        image_url: 'https://assets.empathy.co/images-demo/31335.jpg',
        title: 'Banner title',
        url: 'https://assets.empathy.co/'
      }
    ]
  },
  promoted: {
    content: [
      {
        id: '61f9223221c06701c2f98c17',
        image_url: 'https://assets.empathy.co/images-demo/31335.jpg',
        title: 'Promoted title',
        url: 'https://assets.empathy.co/'
      }
    ]
  },
  direct: {
    content: [
      {
        id: 'bbf9223221c06701c2f98c1a',
        url: 'https://api.staging.empathy.co'
      }
    ]
  }
} as any as PlatformSearchResponse;
