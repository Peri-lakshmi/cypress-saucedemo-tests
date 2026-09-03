// Product sorting tests for saucedemo.com
//
// The inventory page has a dropdown to sort by name (A-Z / Z-A) and
// price (low-high / high-low). Small feature, but it's a common spot
// for off-by-one or string-vs-number sorting bugs, so worth its own file.

describe('Product sorting', () => {
  beforeEach(() => {
    cy.login('standard_user', 'secret_sauce');
  });

  it('sorts products by name A to Z (default state)', () => {
    cy.get('.inventory_item_name').then(($items) => {
      const names = [...$items].map((el) => el.textContent || '');
      const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).to.deep.equal(sortedNames);
    });
  });

  it('sorts products by name Z to A', () => {
    cy.get('[data-test="product-sort-container"]').select('za');

    cy.get('.inventory_item_name').then(($items) => {
      const names = [...$items].map((el) => el.textContent || '');
      const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).to.deep.equal(sortedNames);
    });
  });

  it('sorts products by price low to high', () => {
    cy.get('[data-test="product-sort-container"]').select('lohi');

    cy.get('.inventory_item_price').then(($items) => {
      const prices = [...$items].map((el) => parseFloat((el.textContent || '').replace('$', '')));
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sortedPrices);
    });
  });

  it('sorts products by price high to low', () => {
    cy.get('[data-test="product-sort-container"]').select('hilo');

    cy.get('.inventory_item_price').then(($items) => {
      const prices = [...$items].map((el) => parseFloat((el.textContent || '').replace('$', '')));
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).to.deep.equal(sortedPrices);
    });
  });

  it('keeps the same number of products visible after sorting', () => {
    cy.get('.inventory_item').its('length').then((originalCount) => {
      cy.get('[data-test="product-sort-container"]').select('hilo');
      cy.get('.inventory_item').should('have.length', originalCount);
    });
  });
});
