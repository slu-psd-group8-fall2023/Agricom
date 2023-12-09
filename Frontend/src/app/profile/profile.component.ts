import { Component, ViewChild, ElementRef } from '@angular/core';
import { DefaultService } from "../default.service";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @ViewChild('myModal') modalContent!: ElementRef;

  constructor(private defaultService: DefaultService, private toastr: ToastrService, private authenticationService: AuthenticationService, private _sanitizer: DomSanitizer, private modalService: NgbModal) {
  }
  profilePicture: any;
  userName: any;
  marketListingLoader: Boolean = false;
  feedimage: any;
  marketimage: any;
  feed_posts: any[] = [];
  marketPosts: any[] = [];
  postLoader = false;
  filterParams: any = {}
  selectedPostId: string = '';
  discussionBox: boolean = false;
  commentsLoader: boolean = false;
  commentText: string = '';
  comments: any = [];
  commentsBtnLoader: boolean = false;
  deleteBtnLoader: boolean = false;
  editPostBtnLoader: boolean = false;
  editMarketBtnLoader: boolean = false;
  market_posts: any = {
    name: "",
    year: "",
    contact: "",
    description: "",
    id: "",

  }

  ngOnInit(): void {
    /*this.defaualtService.getUserName(Api).subscribe((data:any)=>{
      username=data;
    })*/
    this.userName = this.authenticationService.userValue?.username;
    this.loadMarketListings()
    this.loadFeedData();
  }

  /**
   * Load market listings created by username, we will be calling api by passing username of logged in user
   */
  loadMarketListings() {
    try {
      this.marketListingLoader = true;
      this.defaultService.httpPostCall(environment.FETCH_MARKET_POSTS_API, { username: this.userName }).subscribe((data: any) => {
        if (data.marketPosts.length) {
          data.marketPosts.forEach((element: any, index: any) => {
            data.marketPosts[index].imageUri = JSON.parse(JSON.stringify(data.marketPosts[index].image));
            data.marketPosts[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image)
            data.marketPosts[index].isEditing = false;
          });
          this.marketPosts = data['marketPosts'];
        }
        this.marketListingLoader = false;
      });
    } catch (e) {
      this.marketListingLoader = false;
      this.toastr.error("Error filtering posts");
    }
  }

  /**
   * Set flag to edit market listing
   * This sets isEditing flasg to true which enables user to edit in frontend
   */
  editMarketPost(marketPostsData: any) {
    marketPostsData.isEditing = true;
  }

  /**
   * Save edited market post, pass whole market listing data
   */
  async saveMarketPostEdit(marketPostsData: any) {

    this.editMarketBtnLoader = true;
    console.log("Submitting")

    try {
      let params = {
        postId: { _id: marketPostsData._id },
        username: marketPostsData.username,
        title: marketPostsData.title,
        content: marketPostsData.content,
        image: [marketPostsData.tempImage ?? marketPostsData.imageUri[0]],
        createdAt: marketPostsData.createdAt,
        contact: marketPostsData.contact,
        year_of_purchase: marketPostsData.year_of_purchase,
        address: marketPostsData.address,
        city: marketPostsData.city,
        state: marketPostsData.state,
        country: marketPostsData.country
      }
      await this.defaultService.httpPostCall(environment.EDIT_MARKET_POSTS_API, params).subscribe(
        (data: any) => {
          this.toastr.success("Succesfully edited post");
          this.editMarketBtnLoader = false;
          marketPostsData.isEditing = false;
          marketPostsData.image = JSON.parse(JSON.stringify(marketPostsData.tempImage));
          delete marketPostsData.tempImage;
        },
        (err: any) => {
          this.toastr.error("Error editing post! \n Please try again");
          console.log(err);
          this.editMarketBtnLoader = false
        }
      )
    } catch (e) {
      this.toastr.error("Error editing post! \n Please try again");
      this.editMarketBtnLoader = false
    }
  }

  /**
   * Unset the edit flag of market listing
   */
  cancelMarketPostEdit(postData: any) {
    postData.isEditing = false;
    delete postData.tempImage;
  }

  /**
   * Handle image upload, convert image to base64 format
   */
  handleMarketPostUpload(event: any, postIndex: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.marketPosts[postIndex].tempImage = reader.result;
    };
  }

  /**
   * Load feed posts created by user, we will be calling api by passing username of logged in user
   */
  loadFeedData() {
    this.postLoader = true;
    this.defaultService.httpPostCall(environment.FETCH_POSTS_API, { username: this.userName }).subscribe((data: any) => {
      data.posts.forEach((element: any, index: any) => {
        data.posts[index].imageUri = JSON.parse(JSON.stringify(data.posts[index].image));
        data.posts[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image[0])
        data.posts[index].isEditing = false;
      });
      this.feed_posts = data.posts;
      this.postLoader = false;
    });
  }

  /**
   * Set flag to edit feed post
   * This sets isEditing flasg to true which enables user to edit in frontend
   */
  editPost(postData: any) {
    postData.isEditing = true;
  }

  /**
   * Save edited feed post, pass whole feed post data
   */
  async savePostEdit(postData: any) {

    this.editPostBtnLoader = true;
    console.log("Submitting")

    try {
      let params = {
        postId: { _id: postData._id },
        username: postData.username,
        title: postData.title,
        content: postData.content,
        image: [postData.tempImage ?? postData.imageUri[0]],
        createdAt: postData.createdAt
      }
      await this.defaultService.httpPostCall(environment.EDIT_POST_API, params).subscribe(
        (data: any) => {
          this.toastr.success("Succesfully editing post");
          this.editPostBtnLoader = false;
          postData.isEditing = false;
          postData.image = JSON.parse(JSON.stringify(postData.tempImage));
          delete postData.tempImage;
        },
        (err: any) => {
          this.toastr.error("Error editing post! \n Please try again");
          console.log(err);
          this.editPostBtnLoader = false
        }
      )
    } catch (e) {
      this.toastr.error("Error editing post! \n Please try again");
      this.editPostBtnLoader = false
    }
  }

  /**
   * Unset the edit flag of feed post
   */
  cancelPostEdit(postData: any) {
    postData.isEditing = false;
    delete postData.tempImage;
  }

  /**
   * Handle image upload, convert image to base64 format
   */
  handleUpload(event: any, postIndex: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.feed_posts[postIndex].tempImage = reader.result;
    };
  }

  onScroll() {

  }

  /**
   * Set/unset flag to display the comment box
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
   * Load comments of selected post
   */
  async getPostComments() {
    let params = {
      postId: this.selectedPostId
    }
    this.defaultService.httpPostCall(environment.GET_COMMENT_API, params).subscribe((data: any) => {
      this.comments = data.comments;
      this.commentsLoader = false;
    });

  }

  /**
   * Function to submit comment and store it to db
   */
  async submitComment() {
    this.commentsBtnLoader = true;
    try {
      let params = {
        postId: this.selectedPostId,
        username: this.userName,
        content: this.commentText,
        createdAt: Date.now()
      }

      console.log(JSON.stringify(params))
      await this.defaultService.httpPostCall(`${environment.ADD_COMMENT_API}`, params).subscribe(
        (data: any) => {
          this.toastr.success("Succesfully posted comment");
          this.comments = data.post.Comments
          this.comments.forEach((element: any, index: number) => {
            element.createdAt = new Date(element.createdAt).toLocaleDateString()
          })
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

  onDelete_feed(id: any) {

  }

  /**
   * Delete a selected market listing
   */
  onDelete_market(postIndex: any) {
    this.deleteBtnLoader = true;
    const postIdToDelete = this.marketPosts[postIndex]._id;
    this.defaultService.httpPostCall(`${environment.DELETE_MARKET_POSTS_API}`, { username: this.userName, postId: postIdToDelete }).subscribe(() => {
      this.marketPosts.splice(postIndex, 1);
      this.deleteBtnLoader = false;
    });
  }

  /**
   * Scroll component to the end
   */
  scrollToBottom(): void {
    try {
      const modalContentElement = this.modalContent.nativeElement;
      modalContentElement.scrollTop = modalContentElement.scrollHeight;
    } catch (err) { }
  }
}

