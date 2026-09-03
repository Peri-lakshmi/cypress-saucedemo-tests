// Custom commands used across the spec files.
// Keeping these here means the actual test files stay readable and we're
// not repeating the same 3-4 lines of login boilerplate in every test.

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in through the UI using the given username/password and
       * waits until the inventory page has loaded.
       */
      login(username: string, password: string): Chainable<void>;

      /**
       * Adds a product to the cart from the inventory page using the
       * product's slug (the bit that appears in the data-test attribute,
       * e.g. "sauce-labs-backpack").
       */
      addProductToCart(productSlug: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/');
  cy.get('#user-name').type(username);
  cy.get('#password').type(password);
  cy.get('#login-button').click();
  cy.url().should('include', '/inventory.html');
});

Cypress.Commands.add('addProductToCart', (productSlug: string) => {
  cy.get(`[data-test="add-to-cart-${productSlug}"]`).click();
});

// this file needs to be a module
export {};
