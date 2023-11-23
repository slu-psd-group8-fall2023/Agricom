import { Component, } from '@angular/core';
import { DefaultService } from "../default.service";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
constructor(private defaualtService:DefaultService){
}
profilePicture:any;
userName:any;
isLoading:Boolean=false;
feedimage:any;
marketimage:any;
feed_posts:any[]=[];

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
}
  
onScroll(){

}
toggleDiscussionBox(){

}

onDelete_feed(id:any){

}
onDelete_market(id:any){

}
}

