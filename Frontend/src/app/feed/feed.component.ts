import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { DefaultService } from "../default.service";
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../services/authentication.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {
  @ViewChild('myModal') modalContent!: ElementRef;

  authService: any;
  user:any;
  constructor(config: NgbModalConfig, private defaultService: DefaultService, private toastr: ToastrService, private _sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private modalService: NgbModal) { 
    config.backdrop = 'static';
		config.keyboard = false;
  }

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
  comments: any = [];
  public commentText:string = '';
  selectedPostId:string='';
  discussionBox:boolean = false;
  commentsLoader:boolean = false;
  commentsBtnLoader:boolean = false;
  createPostBtnLoader:boolean = false;


  //submiting data to backend
  async submitForm() {
    this.createPostBtnLoader = true;
    console.log("Submitting")
    
    // You can access the form data using 'formData' object
    console.log('Form Data:', this.formData);
    try {
      // let data = await this.defaultService.httpPostCall(environment.FORGOT_PASS_API, params);
      let params = {
        username: this.user.username,
        title: this.formData.title,
        content: this.formData.description,
        image: this.formData.picture,
        createdAt: Date.now()
      }
      await this.defaultService.httpPostCall(environment.CREATE_POST_API, params).subscribe(
        (data: any) => {
          this.toastr.success("Succesfully created post");
          let response = data['data'];
          this.loadInitialUserData();
          console.log(response);
          this.createPostBtnLoader = false;
        },
        (err: any) => {
          this.toastr.error("Error creating post! \n Please try again");
          console.log(err);
          this.createPostBtnLoader = false
        }
      )
    } catch (e) {
      this.toastr.error("Error creating post! \n Please try again");
      this.createPostBtnLoader = false
    }
  }

  // angular code to show post on page and onscrolling it retrives the data and shows on ascreen
  users: any[] = [];
  isLoading = false;


  ngOnInit(): void {
    this.loadInitialUserData();
    this.user = this.authenticationService.userValue;
  }

  loadInitialUserData() {
    this.isLoading = true;
    this.defaultService.httpPostCall(environment.FETCH_POSTS_API,{}).subscribe((data: any) => {
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
      this.defaultService.httpPostCall(environment.FETCH_POSTS_API,{}).subscribe((data: any) => {
        if(data.posts[data.posts.length-1]._id!=this.data[this.data.length-1]._id) {
          this.data = this.data.concat(data.posts);
          this.isLoading = false;
        }
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

  toggleDiscussionBox(modal:any, postData:any) {
    this.commentsLoader = true
    this.discussionBox = ! this.discussionBox;
    this.selectedPostId = postData._id
    // this.comments = postData.Comments
    this.commentText = '';
    this.modalService.open(modal, { scrollable: true });
    this.getPostComments();
  }

  async getPostComments() {
    let params = {
      postId: this.selectedPostId
    }
    this.defaultService.httpPostCall(environment.GET_COMMENT_API, params).subscribe((data: any) => {
      this.comments = data.comments;
      this.commentsLoader = false;
    });

  }

  handleUpload(event:any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.formData.picture = reader.result;
    };
  }

  async submitComment() {
    this.commentsBtnLoader = true;
    try {
      let params = {
        postId: this.selectedPostId,
        username: this.user.username,
        content: this.commentText,
        createdAt: Date.now()
      }

      console.log(JSON.stringify(params))
      await this.defaultService.httpPostCall(`${environment.ADD_COMMENT_API}`, params).subscribe(
        (data: any) => {
          this.toastr.success("Succesfully posted comment");
          this.comments = data.post.Comments
          this.commentText = '';
          console.log(data.post._id);
          this.scrollToBottom()
          this.commentsBtnLoader = false;
        },
        (err: any) => {
          this.commentsBtnLoader = false;
          this.toastr.error("Error creating comment! \n Please try again");

          console.log(err);
        }
      )
    } catch (e) {
      this.commentsBtnLoader = false;
      this.toastr.error("Error creating comment! \n Please try again");
    }
  }

  scrollToBottom(): void {
    try {
      const modalContentElement = this.modalContent.nativeElement;
      modalContentElement.scrollTop = modalContentElement.scrollHeight;
    } catch(err) { }                 
}

}
