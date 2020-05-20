describe("Appointments", () => {

  beforeEach(() => {
    cy.visit("/");
    cy.request("GET", "http://localhost:8001/api/debug/reset");
    cy.contains("Monday");
  });

  it("should book an interview", () => {
    // Visits the root of our web server
    // Clicks on the "Add" button in the second appointment
    cy.get("[alt=Add]")
      .first()
      .click()
    // Enters their name
    cy.get("[data-testid=student-name-input]")
      .type("John Smith", { delay: 100})
    // Chooses an interviewer
    cy.get("[alt='Sylvia Palmer']")
      .click()
    // Clicks the save button
    cy.contains("Save")
      .click()
    // Sees the booked appointment
    cy.contains(".appointment__card--show", "John Smith");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  
  });

  it("should edit an interview", () => {
    // Visits the root of our web server
    // Clicks the edit button for the existing appointment 
    cy.get("[alt=Edit]")
      .first()
      .click({force: true})
    // Enters their name
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("John Smith", { delay: 100})
    // Chooses an interviewer
    cy.get("[alt='Tori Malcolm']")
      .click()
    // Clicks the save button
    cy.contains("Save")
      .click()
    // Sees the booked appointment
    cy.contains(".appointment__card--show", "John Smith");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    // Visits the root of our web server
    // Clicks the delete button for the existing appointment 
    cy.get("[alt=Delete]")
      .first()
      .click({force: true})
    // Clicks the confirm button
    cy.contains("Confirm")
      .click()
    // Sees that Deleting indicator is exists
    cy.contains("Deleting")
    // Sees that the  ".appointment__card--show" element that contains the text "Archie Cohen" should not exist
    cy.contains(".appointment__card--show", "Archie Cohen")
    .should("not.exist");
  });

});