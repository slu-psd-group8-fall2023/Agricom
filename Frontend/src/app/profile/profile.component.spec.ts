import { ComponentFixture, TestBed,waitForAsync  } from '@angular/core/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DefaultService } from '../default.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [HttpClientTestingModule, NgSelectModule, ReactiveFormsModule, ToastrModule.forRoot()],
      providers:[DefaultService]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the profile picture and user name displayed', () => {
    component.profilePicture = 'fake_image_url';
    component.userName = 'John Doe';
    fixture.detectChanges();
    const profilePicture = fixture.debugElement.query(By.css('.profile-picture')).nativeElement;
    expect(profilePicture.src).toContain('fake_image_url');
    const profileName = fixture.debugElement.query(By.css('.profile-name')).nativeElement;
    expect(profileName.textContent).toBe('John Doe');
  });

  it('should load feed posts and display them', () => {
    // Setting fake data
    component.feed_posts = [
      { id: 1, title: 'Post 1', content: 'Content 1', image: 'image_url_1' },
      { id: 2, title: 'Post 2', content: 'Content 2', image: 'image_url_2' },
    ];
    fixture.detectChanges();
    const postElements = fixture.debugElement.queryAll(By.css('.custom-card'));
    expect(postElements.length).toBe(2);
    expect(postElements[0].query(By.css('.card-title')).nativeElement.textContent).toBe('Post 1');
    expect(postElements[0].query(By.css('.card-text')).nativeElement.textContent).toBe('Content 1');
    expect(postElements[1].query(By.css('.card-title')).nativeElement.textContent).toBe('Post 2');
    expect(postElements[1].query(By.css('.card-text')).nativeElement.textContent).toBe('Content 2');
  });

  it('should call onDelete_feed method when delete button is clicked for feed post', () => {
    spyOn(component, 'onDelete_feed');
    component.feed_posts = [{ id: 1, title: 'Post 1', content: 'Content 1' }];
    fixture.detectChanges();
    const deleteButton = fixture.debugElement.query(By.css('.btn-danger')).nativeElement;
    deleteButton.click();
    expect(component.onDelete_feed).toHaveBeenCalledWith(1);
  });


 

});
  
  


