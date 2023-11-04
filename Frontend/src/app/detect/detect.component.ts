import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-detect',
  templateUrl: './detect.component.html',
  styleUrls: ['./detect.component.scss'] // If you have a custom CSS file
})
export class DetectComponent {
  picture_error:boolean;
  response_got:any;
  result: any;
  selectedFile: File | null = null;
  title: string = '';
  description: string = '';
  prevent: string = '';
  image_url: any = '';
  supplement_name: string = '';
  supplement_image_url: any = '';
  supplement_buy_link: string = '';
  error1:any='';

  constructor(private http: HttpClient) {
    this.picture_error = false;
    this.response_got=false;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      this.http.post<any>('http://127.0.0.1:5000/submit', formData).subscribe(
        (response:any) => {
          this.result = response.result;
          this.picture_error = false;
          this.response_got=true;
          console.log(this.result)
          this.title = this.result.title;
      this.description = this.result.description;
      this.prevent = this.result.prevent;
      this.image_url = this.result.image_url;
      this.supplement_name = this.result.supplement_name;
      this.supplement_image_url = this.result.supplement_image_url;
      this.supplement_buy_link = this.result.supplement_buy_link;

      // Now you can use these variables as needed in your component
      
        },
        (error:any) => {
          this.picture_error = true;
          this.response_got=false;
          setTimeout(() => {
            this.result = 'please upload the picture of crop leaf';
          }, 2000);
        }
      );
       // Simulating a 2-second delay (replace with actual detection logic)
    }
  }
  
}
