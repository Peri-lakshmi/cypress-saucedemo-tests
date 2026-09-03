// Checkout tests for saucedemo.com
//
// The checkout flow on this site has three steps: cart -> "your
// information" form -> overview -> complete. Most of the actual logic
// worth testing lives in the information form's validation, so that's
// where most of these cases are focused, plus one full happy-path run
// all the way through to the confirmation screen.

describe('Checkout', () => {
  beforeEach(() => {
    cy.login('standard_user', 'secret_sauce');
    cy.addProductToCart('sauce-labs-backpack');
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();
  });

  it('completes the full checkout flow successfully', () => {
    cy.get('[data-test="firstName"]').type('Lakshmi');
    cy.get('[data-test="lastName"]').type('Peri');
    cy.get('[data-test="postalCode"]').type('60329');
    cy.get('[data-test="continue"]').click();

    // overview page - confirm the item and totals are shown correctly
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('.cart_item').should('have.length', 1);
    cy.get('.summary_subtotal_label').should('be.visible');
    cy.get('.summary_total_label').should('be.visible');

    cy.get('[data-test="finish"]').click();

    // confirmation page
    cy.url().should('include', '/checkout-complete.html');
    cy.get('.complete-header').should('have.text', 'Thank you for your order!');
  });

  it('shows an error when first name is missing', () => {
    cy.get('[data-test="lastName"]').type('Peri');
    cy.get('[data-test="postalCode"]').type('60329');
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'First Name is required');
  });

  it('shows an error when last name is missing', () => {
    cy.get('[data-test="firstName"]').type('Lakshmi');
    cy.get('[data-test="postalCode"]').type('60329');
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Last Name is required');
  });

  it('shows an error when postal code is missing', () => {
    cy.get('[data-test="firstName"]').type('Lakshmi');
    cy.get('[data-test="lastName"]').type('Peri');
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Postal Code is required');
  });

  it('cancels out of the information form back to the cart', () => {
    cy.get('[data-test="cancel"]').click();

    cy.url().should('include', '/cart.html');
    cy.get('.cart_item').should('have.length', 1);
  });

  it('cancels out of the overview page back to the inventory page', () => {
    cy.get('[data-test="firstName"]').type('Lakshmi');
    cy.get('[data-test="lastName"]').type('Peri');
    cy.get('[data-test="postalCode"]').type('60329');
    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="cancel"]').click();

    cy.url().should('include', '/inventory.html');
  });

  it('calculates the total as item total plus tax correctly', () => {
    cy.get('[data-test="firstName"]').type('Lakshmi');
    cy.get('[data-test="lastName"]').type('Peri');
    cy.get('[data-test="postalCode"]').type('60329');
    cy.get('[data-test="continue"]').click();

    cy.get('.summary_subtotal_label')
      .invoke('text')
      .then((subtotalText) => {
        const subtotal = parseFloat(subtotalText.replace('Item total: $', ''));

        cy.get('.summary_tax_label')
          .invoke('text')
          .then((taxText) => {
            const tax = parseFloat(taxText.replace('Tax: $', ''));

            cy.get('.summary_total_label')
              .invoke('text')
              .then((totalText) => {
                const total = parseFloat(totalText.replace('Total: $', ''));
                // rounding to 2 decimal places to avoid floating point comparison issues
                expect(Math.round((subtotal + tax) * 100) / 100).to.eq(total);
              });
          });
      });
  });

  it('empties the cart after a completed order', () => {
    cy.get('[data-test="firstName"]').type('Lakshmi');
    cy.get('[data-test="lastName"]').type('Peri');
    cy.get('[data-test="postalCode"]').type('60329');
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="finish"]').click();

    cy.get('[data-test="back-to-products"]').click();

    cy.url().should('include', '/inventory.html');
    cy.get('.shopping_cart_badge').should('not.exist');
  });
});
