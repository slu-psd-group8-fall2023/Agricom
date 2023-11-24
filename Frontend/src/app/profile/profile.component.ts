import { Component, } from '@angular/core';
import { DefaultService } from "../default.service";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
constructor(private defaultService: DefaultService, private toastr: ToastrService, private authenticationService: AuthenticationService, private _sanitizer: DomSanitizer){
}
profilePicture:any;
userName:any;
isLoading:Boolean=false;
feedimage:any;
marketimage:any;
feed_posts:any[]=[];
marketPosts: any[] = [];
postLoader = false;
filterParams: any = {}

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
    this.postLoader = true;
    this.defaultService.httpPostCall(environment.FETCH_MARKET_POSTS_API, {username:this.userName}).subscribe((data: any) => {
      if(data.marketPosts.length) {
        data.marketPosts.forEach((element:any, index:any) => {
          data.marketPosts[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image)
        });
        this.marketPosts = data['marketPosts'];
      }
      this.postLoader = false;
    });
  } catch(e) {
    this.postLoader = false;
    this.toastr.error("Error filtering posts");
  }
}

loadFeedData() {
  this.isLoading = true;
  this.defaultService.httpPostCall(environment.FETCH_POSTS_API,{username:this.userName}).subscribe((data: any) => {
    data.posts.forEach((element:any, index:any) => {
      data.posts[index].image = this._sanitizer.bypassSecurityTrustResourceUrl(element.image[0])
    });
    this.feed_posts = data.posts;
    this.isLoading = false;
  });
}
  
onScroll(){

}
toggleDiscussionBox(){

}

onDelete_feed(id:any){

}
onDelete_market(postIndex:any){
  const postIdToDelete = this.marketPosts[postIndex]._id;
  this.defaultService.httpPostCall(`${environment.DELETE_MARKET_POSTS_API}`, {username:this.userName, postId:postIdToDelete}).subscribe(() => {
    this.marketPosts.splice(postIndex, 1); 
  });
}
}

