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
  // Set values in the form
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

  it('should load and display posts', () => {
    const mockPosts = [
      {
        title: 'Post 1',
        content: 'Content 1',
      },
      {
        title: 'Post 2',
        content: 'Content 2',
      },
    ];
    // Set the component's data property with mock posts
    component.data = mockPosts;
    fixture.detectChanges();
    // Verify that the posts are displayed on the page
    const postCards = fixture.debugElement.queryAll(By.css('.custom-card'));
    expect(postCards.length).toBe(mockPosts.length);
    // Check that the post titles and content are displayed as expected
    for (let i = 0; i < mockPosts.length; i++) {
      const postTitle = postCards[i].query(By.css('.card-title')).nativeElement.textContent;
      const postContent = postCards[i].query(By.css('.card-text')).nativeElement.textContent;
      expect(postTitle).toBe(mockPosts[i].title);
      expect(postContent).toBe(mockPosts[i].content);
      // Add more expectations for other properties if needed
    }
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

    // Act
    await component.submitComment();
  
    // Assert
    expect(toastrServiceMock.error).toHaveBeenCalledWith('Error creating comment! \n Please try again');
    // Ensure that this.comments is not updated when there's an error in the server response
    expect(component.comments).toEqual([]);
    expect(component.commentText).toBe('');
  });
});