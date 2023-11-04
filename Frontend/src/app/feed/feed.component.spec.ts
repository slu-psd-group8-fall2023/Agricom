import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { FeedComponent } from './feed.component';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedComponent],
      imports:[HttpClientTestingModule,FormsModule],
    });
    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the formData object on input changes', () => {
    const titleInput = fixture.nativeElement.querySelector('#title');
    titleInput.value = 'Test Title';
    titleInput.dispatchEvent(new Event('input'));
    
    const descriptionInput = fixture.nativeElement.querySelector('#description');
    descriptionInput.value = 'Test Description';
    descriptionInput.dispatchEvent(new Event('input'));
    
    // Set the file input value if needed (you may need to mock file input changes)
    //console.log(component.formData.title);
    // Trigger the form submit
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    
    // Check if formData is correctly updated
    expect(component.formData.title).toBe('Test Title');
    expect(component.formData.description).toBe('Test Description');
    // Check the file input if necessary
    
  });

  it('should handle infinite scrolling', () => {
    // Simulate a scroll event to trigger onScroll()
    // Check if the data array is updated with new items
  });

  it('should render the correct number of data items', () => {
    // Create a sample data array
    const sampleData = [
      { userId: 1, description: 'Item 1', picture: 'url1' },
      { userId: 2, description: 'Item 2', picture: 'url2' },
      { userId: 3, description: 'Item 3', picture: 'url3' },
    ];
    component.data = sampleData;
    fixture.detectChanges();
    // Verify that the template renders the correct number of items
    const dataItems = fixture.nativeElement.querySelectorAll('.data-item');
    // Expect the number of rendered items to match the length of the sample data array
    expect(dataItems.length).toBe(sampleData.length);
  });

  /*it('should display user information and bind correctly with default values', () => {
    // By default, component properties are empty or null
    // No need to set them explicitly
    fixture.detectChanges();
  
    // Verify that the elements have the default values
    const img = fixture.nativeElement.querySelector('img');
    
    const userId = fixture.nativeElement.querySelector('.card-title');
    const description = fixture.nativeElement.querySelector('.card-text');
    console.log(description);
    // Ensure that the default values are correctly displayed
    expect(img.getAttribute('src')).toBe(null); 
   
  });*/
  
  
  

  it('should handle styling and visibility correctly', () => {
    const dropdownContent = fixture.nativeElement.querySelector('.dropdown-content');
    if (component.isDropdownOpen) {
      expect(dropdownContent.style.display).toBe('block');
    } else {
      expect(dropdownContent.style.display).toBe('none');
    }
  });
});
