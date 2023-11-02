import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
