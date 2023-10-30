import { Component, OnInit, HostListener } from '@angular/core';
import { DefaultService } from "../default.service";
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {

  authService: any;
  constructor(private defaultService: DefaultService, private toastr: ToastrService, private _sanitizer: DomSanitizer) { }

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
      await this.defaultService.httpPostCall(environment.CREATE_POST_API, params).subscribe(
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
    this.defaultService.getData(environment.FETCH_POSTS_API).subscribe((data: any) => {
      data.posts.forEach((element:any, index:any) => {
        data.posts[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image[0])
      });
      this.data = data.posts;
      this.isLoading = false;
    });
  }

  loadMoreUserData() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.defaultService.getData(environment.FETCH_POSTS_API).subscribe((data: any) => {
        this.data = this.data.concat(data.posts);
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

  handleUpload(event:any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.formData.picture = reader.result;
    };
  }
}
