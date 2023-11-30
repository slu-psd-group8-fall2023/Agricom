import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr'; 
import { AuthenticationService } from '../services/authentication.service'; // Replace with the actual path to your AuthenticationService
import { throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Define the activatedRouteStub with mock data
  const activatedRouteStub = {
    paramMap: of(convertToParamMap({ id: '1' })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule, ToastrModule.forRoot()], // Include ToastrModule
      providers: [AuthenticationService,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        /*{ provide: AuthenticationService, useClass: MockAuthenticationService },*/
      ],
    }).compileComponents();

    // Provide a mock for ToastrService to prevent errors
    const toastrServiceMock = {
      success: () => {},
      error: () => {},
      // Add more methods as needed
    };
    TestBed.overrideProvider(ToastrService, { useValue: toastrServiceMock });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the initial state', () => {
    // Check the initial state of variables.
    expect(component.authCtrl.showSignIn).toBe(true);
    expect(component.authCtrl.showSignUp).toBe(false);
    expect(component.authCtrl.showForgotPassword).toBe(false);
    expect(component.authCtrl.showPasswordReset).toBe(false);
    expect(component.authCtrl.name).toBe('');
    expect(component.authCtrl.email).toBe('');
    expect(component.authCtrl.password).toBe('');
    expect(component.authCtrl.newPassword).toBe('');
    expect(component.authCtrl.confirmNewPassword).toBe('');
    expect(component.authCtrl.token).toBe('');
    expect(component.authCtrl.passwordNoMatch).toBe(false);
    expect(component.authCtrl.errorMessage).toBe('');
    // Add more expectations for other variables if needed.
  });

  it('should set showSignUp to true when showSignup is called', () => {
    component.showSignup();
    expect(component.authCtrl.showSignUp).toBe(true);
  });

  it('should set errorMessage when login fails', fakeAsync(() => {
    // Mocking the AuthenticationService
    const authService = TestBed.inject(AuthenticationService); 
    spyOn(authService, 'login').and.returnValue(throwError('Login failed'));
    component.login();
    tick();
    expect(component.toastrMessage).toBe('Invalid email');
  }));
  
  /*it('should navigate to the return URL on successful login', () => {
    // Arrange
    const authService = TestBed.inject(AuthenticationService);
    spyOn(authService, 'login').and.returnValue(of('success'));
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    
    // Act
    component.login();
    
    // Assert
    expect(navigateSpy).toHaveBeenCalledWith(['/feed']); 
  });*/
  
  
});
