import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {

    loggedIn: boolean = false;

    constructor(private authenticationService: AuthenticationService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.authenticationService.user.subscribe(value => {
            console.log("From header")
            console.log(value)
            if (!value?.username) {
                this.router.navigate(['/']);
                this.loggedIn = false
            } else {
                this.loggedIn = true;
            }
            // Subscription received B. It would not happen
            // for an Observable or Subject by default.
        });
    }

    logout() {
        this.authenticationService.logout();
        location.reload();
    }
}