import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = 'https://restcountries.com/v3.1/all';
    constructor(private http: HttpClient) { }

    getAll() {
        // return this.http.get(`${environment.apiUrl}/users`);
    }
    getCountries(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            // Use the map operator to extract only the names
            map(countries => countries.map(country => country.name.common))
        );
      }
}