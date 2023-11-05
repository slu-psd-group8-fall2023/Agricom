import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedComponent } from './feed.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { DefaultService } from '../default.service';
import { of } from 'rxjs';
import { ToastrModule } from 'ngx-toastr'
import { FormsModule } from '@angular/forms';

describe('FeedComponent', () => {
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
    // Simulate loading posts
    const mockPosts = [
      {
        title: 'Post 1',
        content: 'Content 1',
        // Add other properties as needed
      },
      {
        title: 'Post 2',
        content: 'Content 2',
        // Add other properties as needed
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
