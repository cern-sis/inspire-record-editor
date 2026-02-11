/// <reference types="cypress" />

describe("INSPIRE HEP Record Editor", () => {
    beforeEach(() => {
        cy.visit("localhost:3030");
    });

    it("loads the application with search input", () => {
        // Verify header elements are present
        cy.get("input").should("exist");
        cy.contains("INSPIRE ID:").should("exist");

        // Verify the search input has default value
        cy.get("input[type='search']").should("have.value", "593382");

        // Verify tabs are present
        cy.contains("Main").should("exist");
        cy.contains("References").should("exist");
        cy.contains("Authors").should("exist");
    });

    it("fetches an INSPIRE record and displays form fields", () => {
        // Clear and enter a known record ID
        cy.get("input#main-search[type='search']").clear().type("593382");

        // Click search/fetch button
        cy.get(".ant-layout-header button.ant-input-search-button").click();

        // Wait for the record to load and verify success message
        cy.contains("Record loaded", { timeout: 10000 }).should("exist");

        // Verify form fields are populated in the Main tab
        cy.get("#editor-tabs .ant-tabs-tabpane-active").within(() => {
            // Should have form elements rendered
            cy.get("input, textarea, .ant-select").should("have.length.greaterThan", 0);
        });
    });

    it("switches between editor tabs (Main, References, Authors)", () => {
        // Fetch a record first
        cy.get("input#main-search[type='search']").clear().type("593382");
        cy.get(".ant-layout-header button.ant-input-search-button").click();
        cy.contains("Record loaded", { timeout: 10000 }).should("exist");

        // Verify Main tab is active by default
        cy.get(".ant-tabs-tab-active").should("contain", "Main");

        // Switch to References tab
        cy.contains(".ant-tabs-tab", "References").click();
        cy.get(".ant-tabs-tab-active").should("contain", "References");

        // Switch to Authors tab
        cy.contains(".ant-tabs-tab", "Authors").click();
        cy.get(".ant-tabs-tab-active").should("contain", "Authors");

        // Switch back to Main tab
        cy.contains(".ant-tabs-tab", "Main").click();
        cy.get(".ant-tabs-tab-active").should("contain", "Main");
    });

    it("displays preview panel with DOI and JSON tabs", () => {
        // Fetch a record first
        cy.get("input#main-search[type='search']").clear().type("593382");
        cy.get(".ant-layout-header button.ant-input-search-button").click();
        cy.contains("Record loaded", { timeout: 10000 }).should("exist");

        // Find the preview panel (right side)
        cy.get(".previewTabs").within(() => {
            // Verify DOI tab exists
            cy.contains(".ant-tabs-tab", "DOI").should("exist");

            // Verify JSON tab exists
            cy.contains(".ant-tabs-tab", "JSON").should("exist");

            // Click on JSON tab
            cy.contains(".ant-tabs-tab", "JSON").click();

            // Verify JSON content is displayed (should show the record data)
            cy.get(".ant-tabs-tabpane-active").should("exist");
        });
    });

    it("shows 'No DOI available' for records without DOI", () => {
        // Clear the search and don't fetch any record (empty form data)
        // The DOI tab should show the no DOI message since formData is empty

        // Find the preview panel
        cy.get(".previewTabs").within(() => {
            // Click on DOI tab
            cy.contains(".ant-tabs-tab", "DOI").click();

            // Should show "No DOI available" message
            cy.contains("No DOI available").should("exist");
        });
    });
});
