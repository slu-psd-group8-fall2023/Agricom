import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarketComponent } from './market.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr'
import { AuthenticationService } from '../services/authentication.service';
import { DefaultService } from '../default.service';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('MarketComponent', () => {
  let component: MarketComponent;
  let fixture: ComponentFixture<MarketComponent>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let defaultServiceSpy: jasmine.SpyObj<DefaultService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarketComponent],
      imports: [FormsModule,ReactiveFormsModule,NgSelectModule, ToastrModule.forRoot(),HttpClientTestingModule],
    })
    .compileComponents();
  });
    beforeEach(() => {
    fixture = TestBed.createComponent(MarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['userValue']);
    defaultServiceSpy = jasmine.createSpyObj('DefaultService', ['httpPostCall', 'getData']);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadPosts on ngOnInit', () => {
    spyOn(component, 'loadPosts');
    component.ngOnInit();
    expect(component.loadPosts).toHaveBeenCalled();
  });

  it('should set isDropdownOpen to true on toggleDropdown', () => {
    component.isDropdownOpen = false;
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBe(true);
  });

  it('should set formData.image on handleUpload', () => {
    const event = {
      target: {
        files: [new File([''], 'test.png', { type: 'image/png' })],
      },
    } as any;
    component.handleUpload(event);
    expect(component.formData.image).toBeDefined();
  }); 

  it('should call loadPosts on onScroll', fakeAsync(() => {
    spyOn(component, 'loadPosts');
    component.postLoader = false;
    component.onScroll();
    tick();
    expect(component.loadPosts).toHaveBeenCalled();
  }));

});
