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
  onSubmit(event: Event){

  }
  
}
