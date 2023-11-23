import { Component,OnInit, NgModule   } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { DefaultService } from "../default.service";
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
//import { CountryStateService } from './country-state.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
})

export class MarketComponent implements OnInit{
  createPostBtnLoader: boolean = false;
  form: FormGroup;
  submittedData: any = {}; 
  posts: any[] = [];
  isLoading = false;
  user: any;

  constructor(private fb: FormBuilder,private defaultService: DefaultService, private toastr: ToastrService, private authenticationService: AuthenticationService, private _sanitizer: DomSanitizer) {
    this.form = this.fb.group({
      country: [''],
      state: [''],
      city: ['']
    });
  }

ngOnInit(): void {
    this.user = this.authenticationService.userValue;
    this.loadPosts();
}

  isDropdownOpen = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  picture:any;
  data:any;
  formData: any={
    title:'',
    content:'',
    image:'',
    createdAt:'',
    year_of_purchase:'',
    address:'',
    city:'',
    state:'',
    country:'',
  }

  handleUpload(event:any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.formData.image = reader.result;
    }
  }
  submitForm() {
      // Your implementation for submitForm
    }
  

  
  onSubmit() {
    try{
      this.createPostBtnLoader = true;
      this.defaultService.httpPostCall(environment.CREATE_MARKET_POSTS_API,{...this.formData, username: this.user.username, createdAt:Date.now()}).subscribe(
      (data: any) => {
        this.createPostBtnLoader = false;
        this.toastr.success("Tool listed successfully");
        let response = data['data'];
        this.loadPosts();
      },
      (err: any) => {
        this.toastr.error("Error in fetching posts! \n Please try again");
        this.createPostBtnLoader = false;
      // this.loadingData = false;
      }
    )
    } catch (e) {
      this.createPostBtnLoader = false;
      this.toastr.error("Error ! \n Please try again");
    }
  }


loadPosts() {
  this.isLoading = true;
  this.defaultService.getData(environment.FETCH_MARKET_POSTS_API).subscribe((data: any) => {
    data.marketPosts.forEach((element:any, index:any) => {
      data.marketPosts[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image)
    });
    this.posts = this.posts.concat(data['marketPosts']);
    this.isLoading = false;
  });
}

onScroll() {
  if (!this.isLoading) {
    this.loadPosts();
  }
}

  onDelete(postIndex: number) {
    const postIdToDelete = this.posts[postIndex]._id;
    this.defaultService.httpPostCall(`${environment.DELETE_MARKET_POSTS_API}`, {username:this.user.username, postId:postIdToDelete}).subscribe(() => {
      this.posts.splice(postIndex, 1); 
    });
  }
}

