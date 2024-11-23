describe('Login and Navigate to Attendance Page', () => {
  
  it('should log in, navigate to the attendance page, and set attendance to Absent', () => {

    cy.visit('/login');
    cy.get('ion-input[formControlName="email"]').type('raed@hotmail.com');
    cy.get('ion-input[formControlName="password"]').type('raed1234');
    cy.get('ion-button').contains('تسجيل الدخول').click();
    cy.url().should('include', '/tabs');
    cy.get('ion-button').contains('جدولة الرحلة').click();
    cy.url().should('include', '/attendence');
    cy.get('.custom-radio.absent-radio').click();
    cy.get('.custom-radio.absent-radio.selected').should('exist');
    cy.get('ion-button').contains('تسجيل').click();

    
  });
});
