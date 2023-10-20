
// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'YOUR_API_URL'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    // Make an HTTP GET request to fetch data from the API
    return this.http.get(this.apiUrl);
  }
}
