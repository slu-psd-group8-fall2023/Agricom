import { Component, OnInit, HostListener } from '@angular/core';
import { DefaultService } from "../default.service";
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {
  
  constructor(private dataService: DefaultService) {}

    isDropdownOpen = false;
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
// app.ts
    data:any;
    picture:any;
    userId:any;
    description:any;
 formData:any =  {
  title:'',
  picture:'',
  description:''
}

//submiting data to backend
submitForm(): void {
  // Retrieve data from the form and store it in the 'formData' object
  this.formData.title = (document.getElementById('title') as HTMLInputElement).value;
  this.formData.picture = (document.getElementById('picture') as HTMLInputElement).value;
  this.formData.description = (document.getElementById('description') as HTMLTextAreaElement).value;

  // You can access the form data using 'formData' object
  console.log('Form Data:', this.formData);
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
