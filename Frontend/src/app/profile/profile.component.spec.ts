import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthenticationService } from '../services/authentication.service';
import { of } from 'rxjs';
import { DefaultService } from '../default.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr'

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;
    let authService: AuthenticationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfileComponent],
            providers: [AuthenticationService], // Include any necessary providers
            imports: [ToastrModule.forRoot(), HttpClientTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthenticationService);

        // Mock the AuthenticationService
        // spyOn(authService, 'userValue').and.returnValue({ username: 'testUser' });

        fixture.detectChanges();
    });

    it('should create ProfileComponent', () => {
        expect(component).toBeTruthy();
    });

    describe('editPost', () => {
        it('should set post to editable mode', () => {
            const mockPost = {
                username: 'a',
                title: 'b',
                content: 'c', isEditing: false
            };
            component.feed_posts = [mockPost];

            component.editPost(mockPost);

            expect(mockPost.isEditing).toBeTrue();
        });

        it('should cancel edit post when cancel button is clicked', () => {
            const mockPost = {
                username: 'a',
                title: 'b',
                content: 'c', isEditing: true
            };
            component.feed_posts = [mockPost];

            component.cancelPostEdit(mockPost);

            expect(mockPost.isEditing).toBeFalse();
        });
    });

    describe('editMarketPost', () => {
        it('should set post to editable mode', () => {
            const mockListing = {
                username: 'a',
                title: 'b',
                content: 'c', isEditing: false
            };
            component.feed_posts = [mockListing];

            component.editMarketPost(mockListing);

            expect(mockListing.isEditing).toBeTrue();
        });

        it('should cancel edit post when cancel button is clicked', () => {
            const mockListing = {
                username: 'a',
                title: 'b',
                content: 'c', isEditing: true
            };
            component.feed_posts = [mockListing];

            component.cancelMarketPostEdit(mockListing);

            expect(mockListing.isEditing).toBeFalse();
        });
    });

});
