import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DetectComponent } from './detect.component';

describe('DetectComponent', () => {
  let component: DetectComponent;
  let fixture: ComponentFixture<DetectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetectComponent]
    });
    fixture = TestBed.createComponent(DetectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('onSubmit should send an HTTP POST request and update component variables on success', () => {
    const mockResponse = {
      result: {
        title: 'Test Title',
        description: 'Test Description',
        prevent: 'Test Preventive Steps',
        image_url: 'test-image.jpg',
        supplement_name: 'Test Supplement Name',
        supplement_image_url: 'test-supplement-image.jpg',
        supplement_buy_link: 'test-buy-link',
      },
    };
    component.selectedFile = /* Mock a selected file for testing */;

    component.onSubmit(new Event('submit')); // Call the onSubmit method

    const req = HttpTestingController.expectOne('http://127.0.0.1:5000/submit');
    expect(req.request.method).toEqual('POST');

    req.flush(mockResponse); // Simulate a successful HTTP response

    expect(component.result).toEqual(mockResponse.result);
    expect(component.picture_error).toBeFalse();
    expect(component.response_got).toBeTrue();
});
