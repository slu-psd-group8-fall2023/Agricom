import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FeedComponent } from './feed.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { DefaultService } from '../default.service';
import { AuthenticationService } from '../services/authentication.service';
import { of, throwError } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr'
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

describe('FeedComponent Post', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedComponent],
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), FormsModule], 
      providers: [DefaultService],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the post creation form when the "Post" button is clicked', () => {
    const postButton = fixture.debugElement.query(By.css('#dropdown-button')).nativeElement;
    const dropdownContent = fixture.debugElement.query(By.css('#dropdown-content')).nativeElement;
    // Simulate clicking the "Post" button
    postButton.click();
    fixture.detectChanges(); // Trigger change detection
    // Check the actual display style property
    const displayStyle = dropdownContent.style.display;
    expect(displayStyle).toBe('block');
});

it('should submit the post creation form', () => {
  component.formData.title = 'Test Title';
  component.formData.description = 'Test Description';
  component.formData.picture = 'test-image-url.jpg';
  // Spy on the submitForm function to check if it's called
  const submitFormSpy = spyOn(component, 'submitForm');
  // Trigger the submit button click
  const submitButton = fixture.debugElement.query(By.css('#post_submit')).nativeElement;
  submitButton.click();
  // Expect the submitForm function to have been called
  expect(submitFormSpy).toHaveBeenCalled();
});

it('should display the correct number of cards based on nested loops', () => {
  component.data = [
    { title: 'Title 1', username: 'User1', content: 'Content 1' },
    { title: 'Title 2', username: 'User2', content: 'Content 2' },
  ];

  fixture.detectChanges();
  const expectedCardCount = component.data.length * 3;
  const cardElements = fixture.nativeElement.querySelectorAll('.custom-card');
  expect(cardElements.length).toBe(expectedCardCount);
});


  
});

describe('FeedComponent Comment', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let defaultServiceSpy: jasmine.SpyObj<DefaultService>;

  const toastrServiceMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error')
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('DefaultService', ['httpPostCall']);

    modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    TestBed.configureTestingModule({
      declarations: [FeedComponent],
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), FormsModule], 
      providers: [DefaultService, { provide: NgbModal, useValue: modalServiceSpy }, { provide: ToastrService, useValue: toastrServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    defaultServiceSpy = TestBed.inject(DefaultService) as jasmine.SpyObj<DefaultService>;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle discussion box', () => {
    component.toggleDiscussionBox(null, { _id: '1', Comments: [] });
  
    // Assert
    expect(component.discussionBox).toBe(true);
    expect(component.selectedPostId).toBe('1');
    expect(component.comments).toEqual([]);
    expect(component.commentText).toBe('');
    expect(modalServiceSpy.open).toHaveBeenCalled();
  });

  
  
  it('should handle error when submitting a comment', async () => {
    // Arrange
    const mockDefaultService = jasmine.createSpyObj('DefaultService', ['httpPostCall']);
    // Mock the httpPostCall to simulate an error or invalid response
    mockDefaultService.httpPostCall.and.returnValue(Promise.resolve({ post: { _id: '1' } })); // Invalid response
    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    await component.submitComment();
    expect(toastrServiceMock.error).toHaveBeenCalledWith('Error creating comment! \n Please try again');
    expect(component.comments).toEqual([]);
    expect(component.commentText).toBe('');
  });
});