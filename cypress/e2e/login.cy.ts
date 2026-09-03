// Login flow tests for saucedemo.com
//
// Saucedemo ships with a handful of pre-defined accounts specifically
// meant for testing different scenarios (locked out user, one that
// simulates a slow UI, one that renders broken images, etc). All of
// them use the same password: secret_sauce.
//
// Covering these here because they're exactly the kind of thing a real
// QA pass should catch - not just "does login work" but "what happens
// when it's the account that's supposed to be broken".

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('logs in successfully with a valid standard user', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    // successful login should land on the inventory page and show products
    cy.url().should('include', '/inventory.html');
    cy.get('.inventory_item').should('have.length.greaterThan', 0);
  });

  it('shows an error when the password is wrong', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('wrong_password');
    cy.get('#login-button').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Username and password do not match any user in this service');

    // and we should still be on the login page, not redirected anywhere
    cy.url().should('eq', 'https://www.saucedemo.com/');
  });

  it('shows an error when the username does not exist', () => {
    cy.get('#user-name').type('not_a_real_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Username and password do not match any user in this service');
  });

  it('blocks login for the locked out user with a specific message', () => {
    cy.get('#user-name').type('locked_out_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Sorry, this user has been locked out.');
  });

  it('requires a username - shows validation error when username is blank', () => {
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Username is required');
  });

  it('requires a password - shows validation error when password is blank', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#login-button').click();

    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Password is required');
  });

  it('shows the username error first when both fields are left blank', () => {
    cy.get('#login-button').click();

    // the app checks username before password, so this is the message
    // that should come back when neither field is filled in
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain.text', 'Username is required');
  });

  it('clears the error message when the close (x) button is clicked', () => {
    cy.get('#login-button').click();
    cy.get('[data-test="error"]').should('be.visible');

    cy.get('.error-button').click();
    cy.get('[data-test="error"]').should('not.exist');
  });

  it('logs in successfully with performance_glitch_user despite the delay', () => {
    // this account is designed to load slowly - worth explicitly testing
    // that it still gets there instead of timing out or erroring
    cy.get('#user-name').type('performance_glitch_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    // give it a longer timeout since this account intentionally lags
    cy.url({ timeout: 15000 }).should('include', '/inventory.html');
  });

  it('logs out successfully and returns to the login page', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory.html');

    cy.get('#react-burger-menu-btn').click();
    cy.get('#logout_sidebar_link').should('be.visible').click();

    cy.url().should('eq', 'https://www.saucedemo.com/');
    cy.get('#login-button').should('be.visible');
  });
});
