import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { createSimpleFacetStub } from '../../../src/__stubs__/facets-stubs.factory';
import { createResultStub } from '../../../src/__stubs__/results-stubs.factory';

Given('a results API with fallback images', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      banners: [],
      promoteds: [],
      facets: [
        createSimpleFacetStub('brand_facet', createSimpleFilter => [
          createSimpleFilter('Juguetes deportivos', 3, false),
          createSimpleFilter('Puzzles', 0, false),
          createSimpleFilter('Construcción', 7, false),
          createSimpleFilter('Construye', 6, false),
          createSimpleFilter('Disfraces', 0, false)
        ])
      ],
      results: [
        createResultStub('Result 1', {
          images: ['https://picsum.photos/seed/1/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 2', {
          images: ['https://picsum.photos/seed/2/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 3', {
          images: ['https://picsum.photos/seed/3/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 4', {
          images: ['https://picsum.photos/seed/4/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 5', {
          images: ['https://picsum.photos/seed/5/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 6', {
          images: ['https://picsum.photos/seed/6/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 7', {
          images: ['https://picsum.photos/seed/7/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 8', {
          images: ['https://picsum.photos/seed/8/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 9', {
          images: ['https://picsum.photos/seed/9/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 10', {
          images: ['https://picsum.photos/seed/10/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 11', {
          images: ['https://picsum.photos/seed/11/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 12', {
          images: ['https://picsum.photos/seed/12/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 13', {
          images: ['https://picsum.photos/seed/13/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 14', {
          images: ['https://picsum.photos/seed/14/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 15', {
          images: ['https://picsum.photos/seed/15/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 16', {
          images: ['https://picsum.photos/seed/16/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 17', {
          images: ['https://picsum.photos/seed/17/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 18', {
          images: ['https://picsum.photos/seed/18/100/100', 'https://picsum.photos/seed/2/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 19', {
          images: ['product-002-01.jpg', 'product-002-02.jpg'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('Result 20', {
          images: [
            'https://notexistsimage1.com',
            'https://notexistsimage2.com',
            'https://notexistsimage3.com',
            'https://picsum.photos/seed/20/100/100'
          ],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        })
      ],
      totalResults: 7
    });
  }).as('interceptedFallbackResults');
});

When('scroll down is performed', () => {
  cy.getByDataTest('base-scroll').last().scrollTo('bottom', { duration: 1500 });
});

Then(
  'placeholder {int} is replaced for {string}',
  (placeholderIndexItem: number, loadedContent: string) => {
    cy.get('.x-result-picture')
      .eq(placeholderIndexItem)
      .should('not.contain', 'placeholder')
      .getByDataTest(loadedContent)
      .should('exist');
  }
);
