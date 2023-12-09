import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.LOGIN_API}`, { username: email, email, password })
            .pipe(map(userResp => {
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                userResp.authdata = window.btoa(email + ':' + password);
                localStorage.setItem('user', JSON.stringify({ ...userResp, email, ...userResp.user }));
                this.userSubject.next({ ...userResp, email, ...userResp.user });
                return userResp;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}