describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/login'); // Visit the login page
    cy.get('ion-input[formControlName="email"]', { timeout: 10000 }).should('be.visible'); // Ensure the page is loaded and the email input is visible
    
  });

  it('should create the LoginPage component', () => {
    // Ensure the login page is loaded
    cy.get('ion-input[formControlName="email"]').should('be.visible');
    cy.get('ion-input[formControlName="password"]').should('be.visible');
    cy.get('ion-button').should('be.visible');
  });

  it('should display an error message on login failure and press OK', () => {
    cy.get('ion-input[formControlName="email"]').type('wrongemail@hotmail.com'); // Invalid email
    cy.get('ion-input[formControlName="password"]').type('wrongpassword'); // Invalid password
    cy.get('ion-button').contains('تسجيل الدخول').click();
  
  });
  
  
  it('should login successfully', () => {

    cy.get('ion-input[formControlName="email"]').type('raed@hotmail.com');
    cy.get('ion-input[formControlName="password"]').type('raed1234');
    cy.get('ion-button').contains('تسجيل الدخول').click();
    
    cy.url().should('include', '/tabs');  

  });

  it('should navigate to the "New Account" page when sign-up is clicked', () => {
  
    cy.get('ion-button').contains('تسجيل حساب جديد').click();  
    cy.url().should('include', '/newaccount');
    cy.get('ion-input[formControlName="username"]').should('be.visible');
  });

  it('should navigate to the "Forgot Password" page when forgot password is clicked', () => {
  
    cy.get('ion-button').contains('هل نسيت كلمة المرور؟').click(); 
    cy.url().should('include', '/forget-password');
    cy.get('ion-input[formControlName="email"]').should('be.visible');
  });
});
