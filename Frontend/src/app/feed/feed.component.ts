import { Component, OnInit, HostListener } from '@angular/core';
import { DefaultService } from "../default.service";
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {

  authService: any;

  constructor(private defaultService: DefaultService, private toastr: ToastrService) { }

  isDropdownOpen = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  // app.ts
  data: any;
  picture: any;
  userId: any;
  description: any;
  formData: any = {
    title: '',
    picture: '',
    description: ''
  }

  //submiting data to backend
  submitForm(): void {
    console.log("Submitting")
    
    // You can access the form data using 'formData' object
    console.log('Form Data:', this.formData);
    try {
      // let data = await this.defaultService.httpPostCall(environment.FORGOT_PASS_API, params);
      let params = {
        username: this.authService.email,
        title: this.formData.title,
        content: this.formData.description,
        image: this.formData.picture,
        createdAt: Date.now()
      }
      this.defaultService.httpPostCall(environment.CREATE_POST_API, this.formData).subscribe(
        data => {
          this.toastr.success("Succesfully created post");
          let response = data['data'];
          console.log(response);
        },
        err => {
          this.toastr.error("Error creating post! \n Please try again");
          console.log(err);
        }
      )
    } catch (e) {
      // this.errorMessage = e;
    }
  }

  // angular code to show post on page and onscrolling it retrives the data and shows on ascreen
  users: any[] = [];
  isLoading = false;


  ngOnInit(): void {
    this.loadInitialUserData();
  }

  loadInitialUserData() {
    this.isLoading = true;
    this.defaultService.getData(environment.FETCH_POSTS_API).subscribe((data: any) => {
      this.users = data;
      this.isLoading = false;
    });
  }

  loadMoreUserData() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.defaultService.getData(environment.FETCH_POSTS_API).subscribe((data: any) => {
        this.users = this.users.concat(data);
        this.isLoading = false;
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.isLoading
    ) {
      this.loadMoreUserData();
    }
  }
}
