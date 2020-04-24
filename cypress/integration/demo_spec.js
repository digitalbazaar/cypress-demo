/// <reference types="Cypress" />

// Following snippets are from
// https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
const getIframeDocument = () => {
  return cy
    .get('iframe')
    .its('0.contentDocument').should('exist');
};
const getIframeBody = () => {
  return getIframeDocument()
    .its('body').should('not.be.undefined')
    .then(cy.wrap);
};

// describe('clear authn cache', () => {
//   it('clears the cache', () => {
//     cy.visit('https://beta.authn.io/');
//     cy.clearLocalStorage();
//   });
// });

// NOTE: Cypress stores the state of credentials from authn
// This means that the second time you run the wallet demo
// test, it will fail!
describe('wallet demo', () => {
  const site = 'https://chapi-demo-wallet.digitalbazaar.com';
  it('clears cache from authn', () => {
    cy.visit('https://beta.authn.io/');
    cy.clearLocalStorage();
    indexedDB.databases().then(databases => {
      databases.forEach(database => {
        indexedDB.deleteDatabase(database.name);
      });
    });
  });
  it('visits the wallet demo site', () => {
    cy.visit(site).contains('Demo Wallet');
    getIframeBody().contains('Manage credentials');
    getIframeBody().contains('Block');
    getIframeBody().contains('Allow').click();
    cy.get('#loginButton').click();

  });
});
