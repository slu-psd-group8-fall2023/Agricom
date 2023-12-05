import { Component,ViewChild, ElementRef } from '@angular/core';
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

constructor(private defaultService: DefaultService, private toastr: ToastrService, private authenticationService: AuthenticationService, private _sanitizer: DomSanitizer, private modalService: NgbModal){
}
profilePicture:any;
userName:any;
marketListingLoader:Boolean=false;
feedimage:any;
marketimage:any;
feed_posts:any[]=[];
marketPosts: any[] = [];
postLoader = false;
filterParams: any = {}
selectedPostId:string='';
discussionBox:boolean = false;
commentsLoader:boolean = false;
commentText:string = '';
comments: any = [];
commentsBtnLoader:boolean = false;
deleteBtnLoader:boolean = false;

market_posts:any={
  name:"",
  year:"",
  contact:"",
  description:"",
  id:"",

}

ngOnInit(): void {
  /*this.defaualtService.getUserName(Api).subscribe((data:any)=>{
    username=data;
  })*/
  this.userName = this.authenticationService.userValue?.username;
  this.loadMarketListings()
  this.loadFeedData();
}

loadMarketListings() {
  try {
    this.marketListingLoader = true;
    this.defaultService.httpPostCall(environment.FETCH_MARKET_POSTS_API, {username:this.userName}).subscribe((data: any) => {
      if(data.marketPosts.length) {
        data.marketPosts.forEach((element:any, index:any) => {
          data.marketPosts[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image)
        });
        this.marketPosts = data['marketPosts'];
      }
      this.marketListingLoader = false;
    });
  } catch(e) {
    this.marketListingLoader = false;
    this.toastr.error("Error filtering posts");
  }
}

loadFeedData() {
  this.postLoader = true;
  this.defaultService.httpPostCall(environment.FETCH_POSTS_API,{username:this.userName}).subscribe((data: any) => {
    data.posts.forEach((element:any, index:any) => {
      data.posts[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image[0])
    });
    this.feed_posts = data.posts;
    this.postLoader = false;
  });
}
  
onScroll(){

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
        this.comments.forEach((element:any, index:number)=>{
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

onDelete_feed(id:any){

}
onDelete_market(postIndex:any){
  this.deleteBtnLoader = true;
  const postIdToDelete = this.marketPosts[postIndex]._id;
  this.defaultService.httpPostCall(`${environment.DELETE_MARKET_POSTS_API}`, {username:this.userName, postId:postIdToDelete}).subscribe(() => {
    this.marketPosts.splice(postIndex, 1);
    this.deleteBtnLoader = false; 
  });
}

scrollToBottom(): void {
  try {
    const modalContentElement = this.modalContent.nativeElement;
    modalContentElement.scrollTop = modalContentElement.scrollHeight;
  } catch(err) { }                 
}
}

