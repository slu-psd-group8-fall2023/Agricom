import { Component,OnInit, NgModule   } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule  } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
//import { CountryStateService } from './country-state.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
})

export class MarketComponent implements OnInit{
  createPostBtnLoader: boolean = false;
  filterForm!: FormGroup;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];

  constructor(private formBuilder: FormBuilder) { 
    this.filterForm = this.formBuilder.group({
      country: [''],
      state: [''],
      city: ['']
    });
  }

  ngOnInit() {
    this.initForm();
    this.loadCountries();
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
  submitForm() {
      // Your implementation for submitForm
    }
    initForm() {
      this.filterForm = this.formBuilder.group({
        country: [''],
        state: [''],
        city: ['']
      });
    }
  
    loadCountries() {
      //this.dataService.getCountries().subscribe((data: any[]) => {
        //this.countries = data;
      //});
    }

    onCountryChange() {
      /*const selectedCountryId = this.filterForm.get('country').value;
      // Load states based on the selected country
      this.dataService.getStates(selectedCountryId).subscribe((data: any[]) => {
        this.states = data;
        this.filterForm.get('state').setValue(''); // Reset state selection
        this.filterForm.get('city').setValue(''); // Reset city selection
      });*/
    }
  
    onStateChange() {
      /*const selectedStateId = this.filterForm.get('state').value;
      // Load cities based on the selected state
      this.dataService.getCities(selectedStateId).subscribe((data: any[]) => {
        this.cities = data;
        this.filterForm.get('city').setValue(''); // Reset city selection
      });*/
    }

  }

