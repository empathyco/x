describe('e2e testing filters-search component', () => {
  const query = '  oN  ';

  beforeEach(() => {
    cy.visit('/');
    cy.typeQuery('lego');
    cy.getByDataTest('brand-filter').as('brandFilters');
  });

  it('displays brand filters for the query written', () => {
    cy.get('@brandFilters').should('have.length.gt', 0);
  });

  it('sifts the brand filter for the sift query written', () => {
    const normalizedQuery = query.trim().toLowerCase();

    cy.getByDataTest('filters-search-input').type(query);
    cy.get('.x-filters-search--is-sifted').should('exist');
    cy.get('@brandFilters')
      .should('have.length.gt', 0)
      .each(brandFilter => {
        expect(brandFilter.text().toLowerCase()).contains(normalizedQuery);
      });
  });
});
