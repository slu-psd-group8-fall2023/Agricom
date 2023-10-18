import { Component } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
    formData: any = {};
  
    submitForm() {
      // Handle the form submission using Angular, e.g., send data to the server
      console.log('Form Data:', this.formData);
      // You can make an API call or perform other actions as needed
    }
  }
// app.ts

class FormDataModel {
  title: string = '';
  picture: string = '';
  description: string = '';
}

const formData: FormDataModel = new FormDataModel();

function submitForm(): void {
  // Retrieve data from the form and store it in the 'formData' object
  formData.title = (document.getElementById('title') as HTMLInputElement).value;
  formData.picture = (document.getElementById('picture') as HTMLInputElement).value;
  formData.description = (document.getElementById('description') as HTMLTextAreaElement).value;

  // You can access the form data using 'formData' object
  console.log('Form Data:', formData);
}


