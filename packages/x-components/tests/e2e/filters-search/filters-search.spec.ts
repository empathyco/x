import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

Then('facet has filters', () => {
  cy.getByDataTest('brand_facet-filter').should('have.length.at.least', 1)
})

Then('searchable filters are stored', () => {
  cy.getByDataTest('brand_facet-filter').invoke('text').as('searchableFilters')
})

When('{string} is typed in the filters search input', (searchFiltersQuery: string) => {
  cy.getByDataTest('filters-search-brand_facet')
    .getByDataTest('filters-search-input')
    .type(searchFiltersQuery)
})

Then('filters in facet are refined with search, {string}', (searchFiltersQuery: string) => {
  cy.getByDataTest('brand_facet-filter')
    .should(filterElements => {
      filterElements.each((_, filterElement) => {
        expect(filterElement.textContent?.toLowerCase()).to.contain(searchFiltersQuery)
      })
    })
    .invoke('text')
    .as('refinedFilters')
})

Then('searchable filters in facet contain refined filters', function () {
  cy.getByDataTest('brand_facet-filter').should(refinedFilters => {
    refinedFilters.each((_, refinedFilter) => {
      expect(this.searchableFilters).to.contain(refinedFilter.textContent)
    })
  })
})
