describe('New Account Form Validation', () => {
  beforeEach(() => {
    cy.visit('/newaccount');
  });

  it('should validate all form fields correctly', () => {
    cy.get('ion-input[formcontrolname="username"]')
      .find('input')
      .clear()
      .should('have.value', '');
    cy.get('form').then(($form) => {
      $form[0].dispatchEvent(new Event('submit', { bubbles: true }));
    });
    cy.get('ion-note')
      .contains('اسم المستخدم يجب أن يحتوي على أحرف فقط.')
      .should('be.visible');

    cy.get('ion-input[formcontrolname="username"]').type('User123');
    cy.get('ion-note')
      .contains('اسم المستخدم يجب أن يحتوي على أحرف فقط.')
      .should('be.visible');

    cy.get('ion-input[formcontrolname="idNumber"]').type('12345');
    cy.get('ion-note')
      .contains('رقم الهوية يجب أن يتكون من 10 أرقام.')
      .should('be.visible');

    cy.get('ion-input[formcontrolname="phoneNumber"]').type('123456789');
    cy.get('ion-note')
      .contains('رقم الهاتف يجب أن يتكون من 10 أرقام.')
      .should('be.visible');

    cy.get('ion-input[formcontrolname="email"]').type('invalid-email');
    cy.get('ion-note')
      .contains('البريد الإلكتروني غير صالح. يرجى إدخال بريد إلكتروني صحيح.')
      .should('be.visible');

    cy.get('ion-input[formcontrolname="password"]').type('12345');
    cy.get('ion-note')
      .contains('كلمة المرور يجب أن تحتوي على 8 أحرف وأرقام على الأقل.')
      .should('be.visible');

    cy.get('ion-input[formcontrolname="password"]').type('Password123');
    cy.get('ion-input[formcontrolname="confirmPassword"]').type('DifferentPassword123');
    cy.get('ion-note')
      .contains('كلمة المرور وتأكيدها يجب أن تكون متطابقتين.')
      .should('be.visible');

    cy.get('[cy-data=relationship] > ion-select').then((el) => {
      const dom = el[0] as HTMLElement;
      const button = dom.shadowRoot?.querySelector('button');
      if (button) button.click();
    });
    cy.contains('Cancel').click();
    cy.get('[cy-data=relationship] > ion-select')
      .invoke('val')
      .should('eq', '');
  });

  it('should submit the form when all fields are valid', () => {
    cy.get('ion-input[formcontrolname="username"]').type('ValidUsername');
    cy.get('ion-input[formcontrolname="idNumber"]').type('1234567890');
    cy.get('ion-input[formcontrolname="phoneNumber"]').type('1234567890');
    cy.get('ion-input[formcontrolname="email"]').type('test2@example.com');
    cy.get('ion-input[formcontrolname="password"]').type('ValidPassword123');
    cy.get('ion-input[formcontrolname="confirmPassword"]').type('ValidPassword123');
    cy.get('ion-select[formcontrolname="relationship"]').click();

    cy.get('[cy-data=relationship] > ion-select').then((el) => {
      const dom = el[0] as HTMLElement;
      const button = dom.shadowRoot?.querySelector('button');
      if (button) button.click();
    });

    cy.contains('.alert-radio-label', 'أب').click();
    cy.contains('OK').click();

    cy.get('[cy-data=relationship] > ion-select')
      .invoke('val')
      .should('eq', 'father');

    cy.get('ion-button[type="submit"]').click();

    cy.url().should('include', '/addstudent');
  });
});
