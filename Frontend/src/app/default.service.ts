import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})

export class DefaultService {

  constructor(public http: HttpClient) {
  }

  public httpPostCall(url:any, params:any , headers?:any): Observable<any> {
    return this.http.post<any>(url, {body:params}, {
        headers:
          new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          )
      });
  }

  getData(apiUrl:any): Observable<any> {
    // Make an HTTP GET request to fetch data from the API
    return this.http.get(apiUrl);
  }
}