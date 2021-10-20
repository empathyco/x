import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import {
  createHierarchicalFacetStub,
  createNumberRangeFacetStub,
  createSimpleFacetStub
} from '../../../src/__stubs__/facets-stubs.factory';
import { createResultStub } from '../../../src/__stubs__/results-stubs.factory';

Given('a results API response for a misspelled word', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      banners: [],
      promoteds: [],
      facets: [
        createSimpleFacetStub('brand_facet', createSimpleFilter => [
          createSimpleFilter('Juguetes deportivos', 3, false)
        ]),
        createNumberRangeFacetStub('price_facet', createNumberRangeFilter => [
          createNumberRangeFilter({ min: 0, max: 10 }, false)
        ]),
        createNumberRangeFacetStub('age_facet', createNumberRangeFilter => [
          createNumberRangeFilter({ min: 0, max: 1 }, false)
        ]),
        createHierarchicalFacetStub('hierarchical_category', createFilter => [
          ...createFilter('Vehículos y pistas', false, createFilter => [
            ...createFilter('Radiocontrol', false)
          ]),
          ...createFilter('Educativos', false, createFilter => [
            ...createFilter('Juguetes educativos', false)
          ]),
          ...createFilter('Construcción', false, createFilter => [
            ...createFilter('Construye', false)
          ])
        ])
      ],
      results: [
        createResultStub('LEGO Super Mario Pack Inicial: Aventuras con Mario - 71360', {
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
        createResultStub('LEGO Duplo Classic Caja de Ladrillos - 1091', {
          images: ['https://picsum.photos/seed/2/100/100'],
          minAge: 1,
          maxAge: 3,
          price: {
            hasDiscount: false,
            originalValue: 29.99,
            value: 29.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', '1ª CONSTRUCCIÓN']
        }),
        createResultStub('LEGO City Coche Patrulla de Policía - 60239', {
          images: ['https://picsum.photos/seed/3/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 11.99,
            value: 11.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'VEHÍCULOS']
        }),
        createResultStub('LEGO City Police Caja de Ladrillos - 60270', {
          images: ['https://picsum.photos/seed/4/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 39.99,
            value: 39.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('LEGO Friends Parque para Cachorros - 41396', {
          images: ['https://picsum.photos/seed/5/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 11.99,
            value: 11.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('LEGO Creator Ciberdrón - 31111', {
          images: ['https://picsum.photos/seed/6/100/100'],
          minAge: 1,
          maxAge: 12,
          price: {
            hasDiscount: false,
            originalValue: 11.99,
            value: 11.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        }),
        createResultStub('LEGO Technic Dragster - 42103', {
          images: ['https://picsum.photos/seed/7/100/100'],
          minAge: 6,
          maxAge: 9,
          price: {
            hasDiscount: false,
            originalValue: 22.99,
            value: 22.99
          },
          unitAge: 'y',
          brands: ['LEGO'],
          categories: ['CONSTRUCCIÓN', 'CONSTRUYE']
        })
      ],
      totalResults: 7,
      spellcheck: 'lego'
    });
  });
});

Then(
  'spellcheck component is shown and its button contains the spellchecked query {string}',
  (spellcheckedQuery: string) => {
    cy.getByDataTest('spellcheck')
      .should('exist')
      .getByDataTest('set-spellcheck')
      .invoke('text')
      .should('eq', spellcheckedQuery);
  }
);

// Scenario 2
Then('spellcheck component is not shown', () => {
  cy.getByDataTest('spellcheck').should('not.exist');
});

// Scenario 3
When('spellcheck button is clicked', () => {
  cy.getByDataTest('set-spellcheck').click().invoke('text').as('spellcheckedQuery');
});

Then(
  'the spellchecked query is displayed in the search-box',
  function (this: { spellcheckedQuery: string }) {
    cy.getByDataTest('search-input').should('have.value', this.spellcheckedQuery);
  }
);

And('spellcheck button contains the spellchecked query {string}', (spellcheckedQuery: string) => {
  cy.getByDataTest('set-spellcheck').invoke('text').should('eq', spellcheckedQuery);
});
