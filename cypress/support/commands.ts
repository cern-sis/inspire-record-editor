/// <reference types="cypress" />

Cypress.Commands.add("getByDataCy", (value) => {
    cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add(
    "clearTypeBlur",
    { prevSubject: true },
    (subject, text, options) => {
        cy.wrap(subject).as("subject").clear(options);
        cy.get("@subject").type(text, options);
        cy.get("@subject").blur();
    },
);
