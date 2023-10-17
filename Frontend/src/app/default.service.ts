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
    return this.http.post<any>(url, params, { headers: headers });
  }

}