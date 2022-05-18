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
    tagging: {
      query:
        'https://api.staging.empathy.co/tagging/v1/track/empathy/query?q=jeans&lang=en&scope=desktop&totalHits=686&page=1&origin=url%3Aexternal&filtered=true&spellcheck=false'
    },
    facets: [
      {
        facet: 'categoryPaths',
        values: [
          {
            id: '78d9b7366',
            value: 'Apparel',
            count: 736,
            filter: 'categoryIds:78d9b7366',
            children: {
              facet: 'categoryPaths_78d9b7366',
              values: [
                {
                  id: '78d9b7366__8a4e61a33',
                  value: 'Bottomwear',
                  count: 637,
                  filter: 'categoryIds:78d9b7366__8a4e61a33',
                  children: {
                    facet: 'categoryPaths_78d9b7366__8a4e61a33',
                    values: [
                      {
                        id: '78d9b7366__8a4e61a33_aa',
                        value: 'Added',
                        count: 1,
                        filter: 'categoryIds:78d9b7366__8a4e61a33_aa',
                        children: {
                          facet: 'categoryPaths_78d9b7366__8a4e61a33_aa',
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
};

export const searchResponse = {
  banners: [
    {
      id: '61f9223221c06701c2f98c17',
      image: 'https://assets.empathy.co/images-demo/31335.jpg',
      title: 'Banner title',
      url: 'https://assets.empathy.co/',
      modelName: 'Banner',
      tagging: {
        query: {
          url: '',
          params: {
            follow: false
          }
        }
      }
    }
  ],
  facets: [
    {
      filters: [
        {
          children: {
            filters: [
              {
                facetId: 'categoryIds:78d9b7366__8a4e61a33',
                id: 'categoryIds:78d9b7366__8a4e61a33',
                label: 'Bottomwear',
                modelName: 'HierarchicalFilter',
                parentId: 'categoryPaths_78d9b7366',
                selected: false,
                totalResults: 637,
                children: {
                  id: 'categoryPaths_78d9b7366__8a4e61a33',
                  label: 'categoryPaths_78d9b7366__8a4e61a33',
                  modelName: 'HierarchicalFacet',
                  filters: [
                    {
                      facetId: 'categoryIds:78d9b7366__8a4e61a33_aa',
                      id: 'categoryIds:78d9b7366__8a4e61a33_aa',
                      totalResults: 1,
                      label: 'Added',
                      selected: false,
                      modelName: 'HierarchicalFilter',
                      parentId: 'categoryPaths_78d9b7366__8a4e61a33',
                      children: {
                        filters: [
                          {
                            facetId: 'categoryIds:78d9b7366__8a4e61a33_aa_bb',
                            id: 'categoryIds:78d9b7366__8a4e61a33_aa_bb',
                            label: 'Added 2',
                            modelName: 'HierarchicalFilter',
                            parentId: 'categoryPaths_78d9b7366__8a4e61a33_aa',
                            selected: false,
                            totalResults: 1
                          }
                        ],
                        id: 'categoryPaths_78d9b7366__8a4e61a33_aa',
                        label: 'categoryPaths_78d9b7366__8a4e61a33_aa',
                        modelName: 'HierarchicalFacet'
                      }
                    }
                  ]
                }
              },
              {
                facetId: 'categoryIds:78d9b7366__e2f94a4ea',
                id: 'categoryIds:78d9b7366__e2f94a4ea',
                label: 'Topwear',
                modelName: 'HierarchicalFilter',
                parentId: 'categoryPaths_78d9b7366',
                selected: false,
                totalResults: 99
              }
            ],
            id: 'categoryPaths_78d9b7366',
            label: 'categoryPaths_78d9b7366',
            modelName: 'HierarchicalFacet'
          },
          facetId: 'categoryIds:78d9b7366',
          id: 'categoryIds:78d9b7366',
          label: 'Apparel',
          modelName: 'HierarchicalFilter',
          parentId: 'categoryPaths',
          selected: false,
          totalResults: 736
        },
        {
          facetId: 'categoryIds:b08648dbd',
          id: 'categoryIds:b08648dbd',
          label: 'Accessories',
          modelName: 'HierarchicalFilter',
          parentId: 'categoryPaths',
          selected: false,
          totalResults: 43
        },
        {
          facetId: 'categoryIds:ffc61e1e9',
          id: 'categoryIds:ffc61e1e9',
          label: 'Personal Care',
          modelName: 'HierarchicalFilter',
          parentId: 'categoryPaths',
          selected: false,
          totalResults: 9,
          children: {
            filters: [
              {
                facetId: 'categoryIds:ffc61e1e9_aa',
                id: 'categoryIds:ffc61e1e9_aa',
                label: 'Added',
                modelName: 'HierarchicalFilter',
                parentId: 'categoryPaths_ffc61e1e9',
                selected: false,
                totalResults: 1
              }
            ],
            id: 'categoryPaths_ffc61e1e9',
            label: 'categoryPaths_ffc61e1e9',
            modelName: 'HierarchicalFacet'
          }
        },
        {
          facetId: 'categoryIds:e5eef62d8',
          id: 'categoryIds:e5eef62d8',
          label: 'Footwear',
          modelName: 'HierarchicalFilter',
          parentId: 'categoryPaths',
          selected: false,
          totalResults: 6
        }
      ],
      id: 'categoryPaths',
      label: 'categoryPaths',
      modelName: 'HierarchicalFacet'
    },
    {
      filters: [
        {
          facetId: '10.0-20.0',
          id: 'price:10.0-20.0',
          label: '10.0-20.0',
          modelName: 'NumberRangeFilter',
          range: {
            max: 20,
            min: 10
          },
          selected: false,
          totalResults: 97
        },
        {
          facetId: '20.0-30.0',
          id: 'price:20.0-30.0',
          label: '20.0-30.0',
          modelName: 'NumberRangeFilter',
          range: {
            max: 30,
            min: 20
          },
          selected: false,
          totalResults: 80
        },
        {
          facetId: '30.0-40.0',
          id: 'price:30.0-40.0',
          label: '30.0-40.0',
          modelName: 'NumberRangeFilter',
          range: {
            max: 40,
            min: 30
          },
          selected: false,
          totalResults: 85
        },
        {
          facetId: '40.0-50.0',
          id: 'price:40.0-50.0',
          label: '40.0-50.0',
          modelName: 'NumberRangeFilter',
          range: {
            max: 50,
            min: 40
          },
          selected: false,
          totalResults: 75
        },
        {
          facetId: '50.0-60.0',
          id: 'price:50.0-60.0',
          label: '50.0-60.0',
          modelName: 'NumberRangeFilter',
          range: {
            max: 60,
            min: 50
          },
          selected: false,
          totalResults: 88
        },
        {
          facetId: '60.0-70.0',
          id: 'price:60.0-70.0',
          label: '60.0-70.0',
          modelName: 'NumberRangeFilter',
          range: {
            max: 70,
            min: 60
          },
          selected: false,
          totalResults: 62
        },
        {
          facetId: '70.0-80.0',
          id: 'price:70.0-80.0',
          label: '70.0-80.0',
          modelName: 'NumberRangeFilter',
          range: {
            max: 80,
            min: 70
          },
          selected: false,
          totalResults: 84
        },
        {
          facetId: '80.0-90.0',
          id: 'price:80.0-90.0',
          label: '80.0-90.0',
          modelName: 'NumberRangeFilter',
          range: {
            max: 90,
            min: 80
          },
          selected: false,
          totalResults: 86
        },
        {
          facetId: '90.0-100.0',
          id: 'price:90.0-100.0',
          label: '90.0-100.0',
          modelName: 'NumberRangeFilter',
          range: {
            max: 100,
            min: 90
          },
          selected: false,
          totalResults: 79
        }
      ],
      id: 'price',
      label: 'price',
      modelName: 'NumberRangeFacet'
    },
    {
      filters: [
        {
          facetId: 'gender:men',
          id: 'gender:men',
          label: 'men',
          modelName: 'SimpleFilter',
          selected: false,
          totalResults: 421
        },
        {
          facetId: 'gender:women',
          id: 'gender:women',
          label: 'women',
          modelName: 'SimpleFilter',
          selected: false,
          totalResults: 247
        },
        {
          facetId: 'gender:boys',
          id: 'gender:boys',
          label: 'boys',
          modelName: 'SimpleFilter',
          selected: false,
          totalResults: 35
        },
        {
          facetId: 'gender:girls',
          id: 'gender:girls',
          label: 'girls',
          modelName: 'SimpleFilter',
          selected: false,
          totalResults: 28
        },
        {
          facetId: 'gender:unisex',
          id: 'gender:unisex',
          label: 'unisex',
          modelName: 'SimpleFilter',
          selected: false,
          totalResults: 5
        }
      ],
      id: 'gender',
      label: 'gender',
      modelName: 'SimpleFacet'
    }
  ],
  promoted: [
    {
      id: '61f9223221c06701c2f98c17',
      image: 'https://assets.empathy.co/images-demo/31335.jpg',
      title: 'Promoted title',
      url: 'https://assets.empathy.co/',
      modelName: 'Promoted',
      tagging: {
        query: {
          url: '',
          params: {
            follow: false
          }
        }
      }
    }
  ],
  queryTagging: {
    params: {
      filtered: 'true',
      follow: false,
      lang: 'en',
      origin: 'url:external',
      page: '1',
      q: 'jeans',
      scope: 'desktop',
      spellcheck: 'false',
      totalHits: '686'
    },
    url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/query'
  },
  redirections: [
    {
      id: 'bbf9223221c06701c2f98c1a',
      url: 'https://api.staging.empathy.co',
      modelName: 'Redirection',
      tagging: {
        click: {
          url: '',
          params: {
            follow: false
          }
        }
      }
    }
  ],
  results: [
    {
      id: '31335-U',
      identifier: {
        value: '31335-U'
      },
      images: ['https://assets.empathy.co/images-demo/31335.jpg'],
      isWishlisted: false,
      modelName: 'Result',
      name: 'Locomotive Men Washed Blue Jeans',
      price: {
        hasDiscount: false,
        originalValue: 10,
        value: 10
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
            origin: 'url:external',
            page: '1',
            position: '1',
            productId: '31335-U',
            q: 'jeans',
            scope: 'desktop',
            spellcheck: 'false',
            title: 'Locomotive Men Washed Blue Jeans',
            url: 'https://assets.empathy.co/images-demo/31335.jpg'
          },
          url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/add2cart'
        },
        checkout: {
          params: {
            filtered: 'false',
            follow: false,
            lang: 'en',
            origin: 'url:external',
            page: '1',
            position: '1',
            productId: '31335-U',
            q: 'jeans',
            scope: 'desktop',
            spellcheck: 'false',
            title: 'Locomotive Men Washed Blue Jeans',
            url: 'https://assets.empathy.co/images-demo/31335.jpg'
          },
          url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/checkout'
        },
        click: {
          params: {
            filtered: 'false',
            follow: false,
            lang: 'en',
            origin: 'url:external',
            page: '1',
            position: '1',
            productId: '31335-U',
            q: 'jeans',
            scope: 'desktop',
            spellcheck: 'false',
            title: 'Locomotive Men Washed Blue Jeans',
            url: 'https://assets.empathy.co/images-demo/31335.jpg'
          },
          url: 'https://api.staging.empathy.co/tagging/v1/track/empathy/click'
        }
      },
      type: 'Default',
      url: 'https://assets.empathy.co/images-demo/31335.jpg'
    }
  ],
  spellcheck: '',
  totalResults: 1
};
