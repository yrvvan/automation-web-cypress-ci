// cypress/e2e/features/step_definitions/example.js

import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I visit the base URL', () => {
    cy.visit('/');
});

When('I click on the link with text {string}', (linkText) => {
    cy.contains(linkText).click();
});

Then('I should see the URL include {string}', (urlPart) => {
    cy.url().should('include', urlPart);
});

Then('I should type an email {string} in the email field', (email) => {
    cy.get('.action-email')
        .type(email)
        .should('have.value', email);
});
