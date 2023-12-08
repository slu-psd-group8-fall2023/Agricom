import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { DefaultService } from "../default.service";
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from '../services/authentication.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
// import { Socket } from 'ngx-socket-io';
import { io } from 'socket.io-client';
import { SocketioService } from "../socket.service";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') modalContent!: ElementRef;

  authService: any;
  user: any;
  isDropdownOpen = false;
  searchTerm: string = '';
  searchResults: string[] = [];
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
  public commentText: string = '';
  selectedPostId: string = '';
  discussionBox: boolean = false;
  commentsLoader: boolean = false;
  commentsBtnLoader: boolean = false;
  createPostBtnLoader: boolean = false;
  users: any[] = [];
  isLoading = false;
  socket: any;

  /**
   * Execute the commands when a component is created
   */
  constructor(
    // private socket: Socket,
    config: NgbModalConfig, private defaultService: DefaultService, private toastr: ToastrService, private _sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.formData = {
      title: '',
      picture: '',
      description: ''
    }
  }

  /**
   * Submit the details posted by user to create post in feed
   */
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
          this.toggleDropdown();
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

  /**
   * Execute the commands when a component is initiated
   */
  ngOnInit(): void {
    this.socket = io("http://localhost:3000");
    this.loadInitialUserData();

    this.user = this.authenticationService.userValue;
    this.socket.on('newFeedPost', (data: any) => {
      console.log("Socket data");
      console.log(data)
      data.forEach((element: any, index: any) => {
        data[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image[0])
      });
      this.data = data;
    });
  }

  /**
   * Executes when the component is closed/page is closed
   */
  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /**
   * Fetch post data 
   */
  loadInitialUserData() {
    this.isLoading = true;
    this.defaultService.httpPostCall(environment.FETCH_POSTS_API, {}).subscribe((data: any) => {
      data.posts.forEach((element: any, index: any) => {
        data.posts[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image[0])
      });
      this.data = data.posts;
      this.isLoading = false;
    });
  }

  /**
   * Fetch more data from backend while user is scrolling
   */
  loadMoreUserData() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.defaultService.httpPostCall(environment.FETCH_POSTS_API, {}).subscribe((data: any) => {
        if (data.posts[data.posts.length - 1]._id != this.data[this.data.length - 1]._id) {
          this.data = this.data.concat(data.posts);
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Listen for scroll events
   */
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.isLoading
    ) {
      this.loadMoreUserData();
    }
  }

  /** 
  * Open/close the discussion box for a particular post
  */
  toggleDiscussionBox(modal: any, postData: any) {
    this.commentsLoader = true
    this.discussionBox = !this.discussionBox;
    this.selectedPostId = postData._id
    // this.comments = postData.Comments
    this.commentText = '';
    this.modalService.open(modal, { scrollable: true });
    this.getPostComments();
  }

  /**
   * Fetch comments of given post
   */
  async getPostComments() {
    let params = {
      postId: this.selectedPostId
    }
    this.defaultService.httpPostCall(environment.GET_COMMENT_API, params).subscribe((data: any) => {
      this.comments = data.comments;
      this.comments.forEach((element: any, index: number) => {
        element.createdAt = new Date(element.createdAt).toLocaleDateString()
      })
      this.commentsLoader = false;
    });

  }

  /**
   * Convert uploaded image to base64 to store in db
   */
  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.formData.picture = reader.result;
    };
  }

  /**
   * Submit comment posted by user
   */
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
          // this.comments = data.post.Comments
          this.getPostComments();
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

  /**
   * Scroll to bottom of the container
   */
  scrollToBottom(): void {
    try {
      const modalContentElement = this.modalContent.nativeElement;
      modalContentElement.scrollTop = modalContentElement.scrollHeight;
    } catch (err) { }
  }

  /**
   * Implements post search functionality
   */
  onSearch() {
    this.isLoading = true;
    this.defaultService.httpPostCall(environment.FETCH_POSTS_API, { username: this.searchTerm, isSearch: true }).subscribe((data: any) => {
      data.posts.forEach((element: any, index: any) => {
        data.posts[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image[0])
      });
      this.data = data.posts;
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this.toastr.error("Error fetching posts");
    });
  }



}
