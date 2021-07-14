import { mount } from '@cypress/vue';

describe('Sample test file', () => {
  it('renders a message', () => {
    mount({ template: `<button>Hello world</button>` });
    cy.get('button').should('exist');
  });
});
