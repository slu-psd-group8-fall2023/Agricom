import { Component,OnInit, NgModule   } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule  } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../services/user.service';
import { DefaultService } from "../default.service";
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

  constructor(private fb: FormBuilder,private defaultService: DefaultService) {
    this.form = this.fb.group({
      country: [''],
      state: [''],
      city: ['']
    });
  }

ngOnInit(): void {
    
}

  isDropdownOpen = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  picture:any;
  data:any;
  formData: any={
    name:'',
    year:'',
    contact:'',
    address:'',
    city:'',
    description:'',
    state:'',
    country:'',
  }

  handleUpload(event:any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.formData.picture = reader.result;
    }
  }
  submitForm() {
      // Your implementation for submitForm
    }
  

  
    onSubmit() {
      // Assign form values to variables
      const country = this.form.get('country')?.value;
      const state = this.form.get('state')?.value;
      const city = this.form.get('city')?.value;
  
      // Store the data in the object
      this.submittedData = {
        country: country,
        state: state,
        city: city
      };
console.log(this.submittedData )
/*await this.defaultService.httpPostCall(,).subscribe(
  (data: any) => {
    this.toastr.success("wait for tools in your region");
    let response = data['data'];
    this.loadPosts();
  },
  (err: any) => {
    this.toastr.error("Error in fetching posts! \n Please try again");
      this.loadingData = false;
  }
)
} catch (e) {
this.toastr.error("Error ! \n Please try again");

  }*/
}


loadPosts() {
  this.isLoading = true;
  /*this.defaultService.getPosts().subscribe((data: any[]) => {
    this.posts = this.posts.concat(data);
    this.isLoading = false;
    
  });*/
}

onScroll() {
  if (!this.isLoading) {
    this.loadPosts();
  }
}

onDelete(postIndex: number) {
  /*const postIdToDelete = this.posts[postIndex].id; 
  this.defaultService.deletePost(postIdToDelete).subscribe(() => {
    this.posts.splice(postIndex, 1); 
  });
}*/
}
}

