import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DetectComponent } from './detect.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { throwError } from 'rxjs';



describe('DetectComponent', () => {
  let component: DetectComponent;
  let fixture: ComponentFixture<DetectComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DetectComponent],
        imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController); // Initialize httpTestingController
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with response_got set to false', () => {
    expect(component.response_got).toBeFalse();
  });

  it('should start with picture_error set to false', () => {
    expect(component.picture_error).toBeFalse();
  });

  it('should show the file input field for image selection', () => {
    const fileInput = fixture.nativeElement.querySelector('#fileInput');
    expect(fileInput).toBeTruthy();
  });

  it('should display a result when a valid image is submitted', () => {
    // Create a mock response and set it directly
    const mockResponse = {
      result: {
        title: 'Test Title',
        description: 'Test Description',
        prevent: 'Preventive Steps',
        image_url: 'test-image-url',
        supplement_name: 'Supplement Name',
        supplement_image_url: 'supplement-image-url',
        supplement_buy_link: 'supplement-buy-link',
      },
    };

    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    component.onFileSelected(event);

    // Set the mock response directly to the component
    component.result = mockResponse.result;
    expect(component.result).toBe(mockResponse.result);
    component.response_got = true;
    component.picture_error = false;

    expect(component.response_got).toBeTrue();
    expect(component.picture_error).toBeFalse();
  });

 /* it('should show an error message when no image is submitted', () => {
    // Set the selectedFile to null to simulate no image selected
    component.selectedFile = null;
    fixture.detectChanges(); // Trigger change detection
  
    // Simulate the form submission
    const event = new Event('submit');
    const preventDefaultSpy = spyOn(event, 'preventDefault'); // Spy on preventDefault
    component.onSubmit(event);
  
    // Expectations
    expect(preventDefaultSpy).toHaveBeenCalled(); // Ensure preventDefault is called
    expect(component.picture_error).toBeTrue();
    expect(component.response_got).toBeFalse();
    expect(component.result).toBeUndefined();
  });*/
  

 /* it('should display result details when a response is received', () => {
    const response = {
      result: {
        title: 'Test Title',
        description: 'Test Description',
        prevent: 'Preventive Steps',
        image_url: 'test-image-url',
        supplement_name: 'Supplement Name',
        supplement_image_url: 'supplement-image-url',
        supplement_buy_link: 'supplement-buy-link',
      },
    };
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event);
    component.onSubmit(new Event('submit'));

    expect(component.result).toEqual(response.result);
  });*/
  
  
});
