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

  constructor(private dataService: DefaultService, private toastr: ToastrService) { }

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
  async submitForm() {
    console.log("Submitting")
    
    // You can access the form data using 'formData' object
    console.log('Form Data:', this.formData);
    try {
      // let data = await this.defaultService.httpPostCall(environment.FORGOT_PASS_API, params);
      let params = {
        username: "udkr1996@gmail.com",
        title: this.formData.title,
        content: this.formData.description,
        image: this.formData.picture,
        createdAt: Date.now()
      }
      await this.dataService.httpPostCall(environment.CREATE_POST_API, params).subscribe(
        (data: any) => {
          this.toastr.success("Succesfully created post");
          let response = data['data'];
          console.log(response);
        },
        (err: any) => {
          this.toastr.error("Error creating post! \n Please try again");
          console.log(err);
        }
      )
    } catch (e) {
      this.toastr.error("Error creating post! \n Please try again");
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
    this.dataService.getData().subscribe((data:any) => {
      this.users = data;
      this.isLoading = false;
    });
  }

  loadMoreUserData() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.dataService.getData().subscribe((data:any) => {
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
