import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

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
  
  
});
