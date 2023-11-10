import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthenticationService', ['user', 'logout']);
    const userSubject = new BehaviorSubject({ username: 'testuser' });
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthenticationService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be logged in', () => {
    expect(component.loggedIn).toBe(false);
  });

});
