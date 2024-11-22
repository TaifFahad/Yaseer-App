// import { ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
// import { AuthService } from '../services/auth.service';
// import { LoginPage } from './login.page';
// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// //email: 'raed@hotmail.com', password: 'raed1234'

// describe('LoginPage', () => {
//   let component: LoginPage;
//   let fixture: ComponentFixture<LoginPage>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let routerSpy: jasmine.SpyObj<Router>;
//   let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
//   let alertControllerSpy: jasmine.SpyObj<AlertController>;

//   beforeEach(waitForAsync(() => {
//     // Mock dependencies
//     authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
//     routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
//     loadingControllerSpy = jasmine.createSpyObj('LoadingController', ['create']);
//     alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

//     // Mock LoadingController.create to return a resolved promise with a mock loading element
//     const loadingMock = {
//       present: jasmine.createSpy('present'),
//       dismiss: jasmine.createSpy('dismiss'),
//     } as unknown as HTMLIonLoadingElement;

//     loadingControllerSpy.create.and.returnValue(Promise.resolve(loadingMock));

//     TestBed.configureTestingModule({
//       declarations: [LoginPage],
//       imports: [IonicModule.forRoot(), ReactiveFormsModule],
//       providers: [
//         { provide: AuthService, useValue: authServiceSpy },
//         { provide: Router, useValue: routerSpy },
//         { provide: LoadingController, useValue: loadingControllerSpy },
//         { provide: AlertController, useValue: alertControllerSpy },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(LoginPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   }));

//   it('should create the LoginPage component', () => {
//     expect(component).toBeTruthy();
//   });
  

  
//   it('should log in successfully and navigate to the home page', async () => {
//     // Mock successful login
//     authServiceSpy.login.and.returnValue(Promise.resolve(true));

//     // Set form values
//     component.credentials.setValue({ email: 'raed@hotmail.com', password: 'raed1234' });

//     // Call the login method
//     await component.login();

//     // Verify AuthService login was called
//     expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'raed@hotmail.com', password: 'raed1234'});

//     // Verify navigation to the home page
//     expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/tabs', { replaceUrl: true });
//   });

  
//   it('should show an alert on login failure', async () => {
//     authServiceSpy.login.and.returnValue(Promise.resolve(false));
//     const alertMock = {
//       present: jasmine.createSpy('present'),
//     } as unknown as HTMLIonAlertElement;
  
//     alertControllerSpy.create.and.returnValue(Promise.resolve(alertMock));
//     component.credentials.setValue({ email: 'test@example.com', password: 'password123' });
  
//     await component.login();
  
//     expect(alertControllerSpy.create).toHaveBeenCalledWith({
//       header: 'Login failed',
//       message: 'Please try again',
//       buttons: ['OK'],
//     });
//     expect(alertMock.present).toHaveBeenCalled();
//   });

  
//   it('should navigate to the "New Account" page when sign-up is clicked', () => {
//     component.goToSignUp();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['/newaccount']);
//   });

//   it('should navigate to the "Forgot Password" page when forgot password is clicked', () => {
//     component.gotoforgetpassword();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['/forget-password']);
//   });
  
// });

