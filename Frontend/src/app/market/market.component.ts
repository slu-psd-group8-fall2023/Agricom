import { Component,OnInit, NgModule   } from '@angular/core';
import { FormsModule  } from '@angular/forms';
//import { CountryStateService } from './country-state.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})

export class MarketComponent {
  createPostBtnLoader: boolean = false;
  
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
    region:'',
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
  onCountryChange() {
      // Your implementation for onCountryChange
    }
  
  submitForm() {
      // Your implementation for submitForm
    }
  }

