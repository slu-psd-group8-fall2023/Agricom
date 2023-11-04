import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports:[HttpClientTestingModule,FormsModule],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the initial sign-in form', () => {
    // Set up the component or action that displays the sign-in form
    component.authCtrl.showSignIn = true;
    fixture.detectChanges();
  
    // Find elements related to the sign-in form
    const emailInput = fixture.nativeElement.querySelector('input[name="Email"]');
    const passwordInput = fixture.nativeElement.querySelector('input[name="Password"]');
    const signInButton = fixture.nativeElement.querySelector('button.btn-primary');
  
    // Verify that the sign-in form elements are displayed
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(signInButton).toBeTruthy();
  
  });
  it('should show the sign-in form by default', () => {
    expect(component.authCtrl.showSignIn).toBeTruthy();
    expect(component.authCtrl.showSignUp).toBeFalsy();
    expect(component.authCtrl.showPasswordReset).toBeFalsy();
    expect(component.authCtrl.showForgotPassword).toBeFalsy();
  });

  it('should reset the authCtrl when switching between forms', () => {
    // Switch to Sign Up
    component.showSignup();
    expect(component.authCtrl.showSignIn).toBeFalsy();
    expect(component.authCtrl.showSignUp).toBeTruthy();
    expect(component.authCtrl.showPasswordReset).toBeFalsy();
    expect(component.authCtrl.showForgotPassword).toBeFalsy();

    // Reset should set all form flags to false
    component.reset();
    expect(component.authCtrl.showSignIn).toBeFalsy();
    expect(component.authCtrl.showSignUp).toBeFalsy();
    expect(component.authCtrl.showPasswordReset).toBeFalsy();
    expect(component.authCtrl.showForgotPassword).toBeFalsy();
  });
  it('set the email input value in the "Password Reset" form', () => {
    component.authCtrl.showPasswordReset = true;
    //setting static email and checking it
    component.authCtrl.email = 'test@example.com';
    fixture.detectChanges();
  });
  it('should set the resetpassword input values in the "Password Reset" form', () => {
    component.authCtrl.showPasswordReset = true;
    const token = fixture.debugElement.query(By.css('input[name="Token"]')).nativeElement;
    const password = fixture.debugElement.query(By.css('input[name="Password"]')).nativeElement;
    const confirm_password = fixture.debugElement.query(By.css('input[name="Confirm Password"]')).nativeElement;
    password.dispatchEvent(new Event('input'));
    confirm_password.dispatchEvent(new Event('input'));
    token.value = '123456'; // Set the token property
    password.value='harish'//set password
    confirm_password.value='harih'//set password
    const signInButton = fixture.debugElement.query(By.css('.btn.btn-primary'));
    signInButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.authCtrl.token.value).toBe('123456'); // Expect the input value to be '123456'
    component.authCtrl.resetPasssword() 
    console.log(component.authCtrl.errorMessage.value)
    expect(component.authCtrl.errorMessage).toBe('Passwords do not match');

  });

  it('should bind email and password inputs to the component properties', () => {
    fixture.detectChanges();

    // Simulate user input by setting values in the input elements
    const emailInput = fixture.debugElement.query(By.css('input[name="Email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name="Password"]')).nativeElement;

    emailInput.value = 'test@example.com';
    passwordInput.value = 'password123';

    // Trigger input events to update ngModel bindings
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    expect(component.authCtrl.email).toBe('test@example.com');
    expect(component.authCtrl.password).toBe('password123');
  });

  it('should simulate a sign-in attempt and check if the form is submitted', () => {
    // Set email and password in the component
    component.authCtrl.email = 'test@example.com';
    component.authCtrl.password = 'password123';
    fixture.detectChanges();
    const signInButton = fixture.debugElement.query(By.css('.btn.btn-primary'));
    // Simulate a button click to attempt sign-in
    signInButton.triggerEventHandler('click', null);
  });

});
