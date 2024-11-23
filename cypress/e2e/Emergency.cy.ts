describe('Emergency Notifications Display', () => {
  
  it('should log in, navigate to emergency page, and display messages', () => {
    
    cy.visit('/login');
    
    cy.get('ion-input[formControlName="email"]').type('raed@hotmail.com');
    cy.get('ion-input[formControlName="password"]').type('raed1234');
    cy.get('ion-button').contains('تسجيل الدخول').click();
    
    cy.url().should('include', '/tabs');  
    
    cy.url().should('include', '/tabs');
    
    cy.get('ion-icon[name="warning-outline"]').click();
    
    cy.url().should('include', '/emergency');
    
    cy.get('ion-list').should('be.visible');
    cy.get('ion-item').should('have.length.greaterThan', 0); 
    
  });

});