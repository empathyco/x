import { SearchResponse } from '@empathyco/x-adapter';
import {
  createHierarchicalFacetStub,
  createSimpleFacetStub
} from '../../../../../src/__stubs__/facets-stubs.factory';
import { createResultStub } from '../../../../../src/__stubs__/results-stubs.factory';

describe('testing Search', () => {
  const results = {
    jacket: 'Jacket chingona',
    longSleeveShirt: 'Long sleeve shirt',
    floralLongSleeveShirt: 'Floral long sleeve shirt',
    classicLongSleeveShirt: 'Classic long sleeve shirt',
    shortSleeveShirt: 'Short sleeve shirt',
    floralShortSleeveShirt: 'Floral short sleeve shirt',
    classicShortSleeveShirt: 'Classic short sleeve shirt'
  };

  const filters = {
    gender: {
      women: 'Women',
      men: 'Men'
    },
    size: {
      small: 'Small',
      medium: 'Medium',
      large: 'Large'
    },
    category: {
      shirts: 'Shirts',
      jackets: 'Jackets',
      longSleeve: 'Long sleeve',
      shortSleeve: 'Short sleeve',
      floral: 'Floral',
      classic: 'Classic'
    }
  };

  const getDefaultSearchResponse = (): Partial<SearchResponse> => ({
    totalResults: 6,
    results: [
      createResultStub(results.jacket),
      createResultStub(results.longSleeveShirt),
      createResultStub(results.classicLongSleeveShirt),
      createResultStub(results.floralLongSleeveShirt),
      createResultStub(results.shortSleeveShirt),
      createResultStub(results.classicShortSleeveShirt),
      createResultStub(results.floralShortSleeveShirt)
    ],
    facets: [
      createSimpleFacetStub('Gender', createFilter => [
        createFilter(filters.gender.women, false),
        createFilter(filters.gender.men, false)
      ]),
      createSimpleFacetStub('Size', createFilter => [
        createFilter(filters.size.small, false),
        createFilter(filters.size.medium, false),
        createFilter(filters.size.large, false)
      ]),
      createHierarchicalFacetStub('Category', createFilter => [
        createFilter(filters.category.shirts, false),
        createFilter(filters.category.jackets, false)
      ])
    ]
  });
  const defaultProductNames = getDefaultSearchResponse().results!.map(result => result.name);

  beforeEach(() => {
    cy.visit('/search?useMockedAdapter=true');
    cy.fakeSearchResponse(getDefaultSearchResponse());
    cy.searchQuery(filters.category.shirts);
  });

  describe('testing Facets', () => {
    it('searches when a simple filter is clicked', () => {
      cy.log('Select the Men filter');
      cy.fakeSearchResponse({
        results: [createResultStub(results.shortSleeveShirt)],
        facets: getDefaultSearchResponse().facets
      });
      cy.clickFilterWithLabel(filters.gender.men, { filterShouldBe: 'selected' });
      cy.waitForResultsToRender();
      assertResultsAre(results.shortSleeveShirt);
      cy.assertFilterIs(filters.gender.men, 'selected');

      cy.log('Select the Women filter');
      cy.fakeSearchResponse({
        ...getDefaultSearchResponse(),
        results: [createResultStub(results.floralLongSleeveShirt)]
      });
      cy.clickFilterWithLabel(filters.gender.women, { filterShouldBe: 'selected' });
      cy.assertFilterIs(filters.gender.men, 'unselected');
      cy.waitForResultsToRender();
      assertResultsAre(results.floralLongSleeveShirt);
      cy.assertFilterIs(filters.gender.women, 'selected');
      cy.assertFilterIs(filters.gender.men, 'unselected');

      cy.log('Deselect the Women filter');
      cy.fakeSearchResponse(getDefaultSearchResponse());
      cy.clickFilterWithLabel(filters.gender.women);
      cy.getSelectedFilters().should('not.exist');
      cy.waitForResultsToRender();
      assertResultsAre(...defaultProductNames);
      cy.getSelectedFilters().should('not.exist');
    });

    it('searches when a hierarchical filter is selected', () => {
      cy.fakeSearchResponse({
        results: [
          createResultStub(results.longSleeveShirt),
          createResultStub(results.classicLongSleeveShirt),
          createResultStub(results.floralLongSleeveShirt),
          createResultStub(results.shortSleeveShirt),
          createResultStub(results.classicShortSleeveShirt),
          createResultStub(results.floralShortSleeveShirt)
        ],
        facets: [
          createHierarchicalFacetStub('Category', createFilter => [
            createFilter(filters.category.shirts, false, createFilter => [
              createFilter(filters.category.longSleeve, false),
              createFilter(filters.category.shortSleeve, false)
            ]),
            createFilter(filters.category.jackets, false)
          ])
        ]
      });
      cy.clickFilterWithLabel(filters.category.shirts, { filterShouldBe: 'selected' });
      cy.waitForResultsToRender();
      assertResultsAre(
        results.longSleeveShirt,
        results.classicLongSleeveShirt,
        results.floralLongSleeveShirt,
        results.shortSleeveShirt,
        results.classicShortSleeveShirt,
        results.floralShortSleeveShirt
      );
      cy.assertFilterIs(filters.category.shirts, 'selected');

      cy.log('Select a child filter');
      cy.fakeSearchResponse({
        results: [
          createResultStub(results.longSleeveShirt),
          createResultStub(results.floralLongSleeveShirt),
          createResultStub(results.classicLongSleeveShirt)
        ],
        facets: [
          createHierarchicalFacetStub('Category', createFilter => [
            createFilter(filters.category.shirts, false, createFilter => [
              createFilter(filters.category.longSleeve, false, createChildren => [
                createChildren(filters.category.floral, false),
                createChildren(filters.category.classic, false)
              ]),
              createFilter(filters.category.shortSleeve, false)
            ]),
            createFilter(filters.category.jackets, false)
          ])
        ]
      });
      cy.clickFilterWithLabel(filters.category.longSleeve, { filterShouldBe: 'selected' });
      cy.assertFilterIs(filters.category.shirts, 'selected');
      cy.waitForResultsToRender();
      assertResultsAre(
        results.longSleeveShirt,
        results.floralLongSleeveShirt,
        results.classicLongSleeveShirt
      );
      cy.assertFilterIs(filters.category.shirts, 'selected');
      cy.assertFilterIs(filters.category.longSleeve, 'selected');

      cy.log('Deselect shirts filter');
      cy.fakeSearchResponse(getDefaultSearchResponse());
      cy.clickFilterWithLabel(filters.category.shirts);
      cy.getSelectedFilters().should('not.exist');
      cy.waitForResultsToRender();
      assertResultsAre(...defaultProductNames);
      cy.getSelectedFilters().should('not.exist');
    });

    it('selects multi-select filters', () => {
      cy.log('Select Small filter');
      cy.fakeSearchResponse({
        ...getDefaultSearchResponse(),
        results: [createResultStub(results.longSleeveShirt)]
      });
      cy.clickFilterWithLabel(filters.size.small, { filterShouldBe: 'selected' });
      cy.waitForResultsToRender();
      assertResultsAre(results.longSleeveShirt);
      cy.assertFilterIs(filters.size.small, 'selected');

      cy.log('Select Medium filter');
      cy.fakeSearchResponse({
        ...getDefaultSearchResponse(),
        results: [
          createResultStub(results.longSleeveShirt),
          createResultStub(results.shortSleeveShirt)
        ]
      });
      cy.clickFilterWithLabel(filters.size.medium, { filterShouldBe: 'selected' });
      cy.assertFilterIs(filters.size.small, 'selected');
      cy.waitForResultsToRender();
      assertResultsAre(results.longSleeveShirt, results.shortSleeveShirt);
      cy.assertFilterIs(filters.size.small, 'selected');
      cy.assertFilterIs(filters.size.medium, 'selected');

      cy.log('Deselect Small filter');
      cy.fakeSearchResponse({
        ...getDefaultSearchResponse(),
        results: [createResultStub(results.longSleeveShirt)]
      });
      cy.clickFilterWithLabel(filters.size.small, { filterShouldBe: 'unselected' });
      cy.assertFilterIs(filters.size.medium, 'selected');
      cy.waitForResultsToRender();
      assertResultsAre(results.longSleeveShirt);
      cy.assertFilterIs(filters.size.small, 'unselected');
      cy.assertFilterIs(filters.size.medium, 'selected');

      cy.log('Deselect Medium filter');
      cy.fakeSearchResponse(getDefaultSearchResponse());
      cy.clickFilterWithLabel(filters.size.medium);
      cy.getSelectedFilters().should('not.exist');
      cy.waitForResultsToRender();
      assertResultsAre(...defaultProductNames);
      cy.getSelectedFilters().should('not.exist');
    });

    describe('clearing filters', () => {
      beforeEach(() => {
        cy.fakeSearchResponse(getDefaultSearchResponse());
        cy.clickFilterWithLabel(filters.gender.women);
        cy.waitForResultsToRender();
        cy.clickFilterWithLabel(filters.size.small);
        cy.waitForResultsToRender();
        cy.clickFilterWithLabel(filters.size.medium);
        cy.waitForResultsToRender();
        cy.clickFilterWithLabel(filters.category.shirts);
        cy.waitForResultsToRender();
        cy.getSelectedFilters().should('have.length', 4);
      });

      it('clears all filters when clicking the clear all filters button', () => {
        cy.getByDataTest('clear-filters').click();
        cy.getSelectedFilters().should('not.exist');
        cy.waitForResultsToRender();
        cy.getSelectedFilters().should('not.exist');
      });

      it('clears all filters when clearing the query', () => {
        cy.clearSearchInput();
        cy.getSelectedFilters().should('not.exist');
        cy.fakeSearchResponse(getDefaultSearchResponse());
        cy.searchQuery('lego');
        cy.waitForResultsToRender();
        cy.getSelectedFilters().should('not.exist');
      });
    });
  });

  /**
   * Tests that the rendered results are the provided ones.
   *
   * @param resultNames - The names that the rendered results should have.
   */
  function assertResultsAre(...resultNames: string[]): void {
    cy.getByDataTest('result').should('have.length', resultNames.length);
    resultNames.forEach((resultTitle, index) => {
      cy.getByDataTest('result').eq(index).should('have.text', resultTitle);
    });
  }
});
