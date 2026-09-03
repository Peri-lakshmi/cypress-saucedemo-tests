// Cart tests for saucedemo.com
//
// Using the custom cy.login() command here (defined in support/commands.ts)
// so each test isn't repeating the same three login lines. Product slugs
// used with addProductToCart come straight from the data-test attributes
// in the DOM, e.g. data-test="add-to-cart-sauce-labs-backpack".

describe('Cart', () => {
  beforeEach(() => {
    cy.login('standard_user', 'secret_sauce');
  });

  it('starts with an empty cart and no badge shown', () => {
    cy.get('.shopping_cart_badge').should('not.exist');
  });

  it('adds a single item to the cart and updates the badge count', () => {
    cy.addProductToCart('sauce-labs-backpack');

    cy.get('.shopping_cart_badge').should('have.text', '1');
  });

  it('adds multiple items and shows the correct total count', () => {
    cy.addProductToCart('sauce-labs-backpack');
    cy.addProductToCart('sauce-labs-bike-light');
    cy.addProductToCart('sauce-labs-bolt-t-shirt');

    cy.get('.shopping_cart_badge').should('have.text', '3');
  });

  it('lists the correct items in the cart with matching names and prices', () => {
    cy.get('.inventory_item')
      .contains('.inventory_item_name', 'Sauce Labs Backpack')
      .parents('.inventory_item')
      .find('.inventory_item_price')
      .invoke('text')
      .then((backpackPrice) => {
        cy.addProductToCart('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();

        cy.get('.cart_item').should('have.length', 1);
        cy.get('.inventory_item_name').should('contain.text', 'Sauce Labs Backpack');
        cy.get('.inventory_item_price').should('have.text', backpackPrice);
      });
  });

  it('button changes from "Add to cart" to "Remove" once an item is added', () => {
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('contain.text', 'Add to cart');

    cy.addProductToCart('sauce-labs-backpack');

    cy.get('[data-test="remove-sauce-labs-backpack"]').should('contain.text', 'Remove');
  });

  it('removes an item from the inventory page and clears the badge', () => {
    cy.addProductToCart('sauce-labs-backpack');
    cy.get('.shopping_cart_badge').should('have.text', '1');

    cy.get('[data-test="remove-sauce-labs-backpack"]').click();

    cy.get('.shopping_cart_badge').should('not.exist');
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').should('contain.text', 'Add to cart');
  });

  it('removes an item directly from the cart page', () => {
    cy.addProductToCart('sauce-labs-backpack');
    cy.addProductToCart('sauce-labs-bike-light');

    cy.get('.shopping_cart_link').click();
    cy.get('.cart_item').should('have.length', 2);

    cy.get('[data-test="remove-sauce-labs-backpack"]').click();

    cy.get('.cart_item').should('have.length', 1);
    cy.get('.shopping_cart_badge').should('have.text', '1');
  });

  it('keeps cart contents when navigating back to products from the cart page', () => {
    cy.addProductToCart('sauce-labs-backpack');
    cy.get('.shopping_cart_link').click();

    cy.get('[data-test="continue-shopping"]').click();

    cy.url().should('include', '/inventory.html');
    cy.get('.shopping_cart_badge').should('have.text', '1');
  });
});
