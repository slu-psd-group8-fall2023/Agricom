import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class DefaultService {

  constructor(public http: HttpClient) {
  }

  public async httpPostCall(url:any, params:any , headers?:any) {
    this.http.post(url, params, { headers: headers }).subscribe({next: data => {
        return data;
    },
    error: error => {
        console.error('There was an error!', error);
        return error.error;
    }});
  }

}