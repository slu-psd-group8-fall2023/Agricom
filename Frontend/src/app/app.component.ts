import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'agri-com';
  loggedIn:boolean = false;

  constructor(private authenticationService:AuthenticationService) {
    this.authenticationService.user.subscribe(value => {
      console.log("From header")
      console.log(value)
      if(!value) {
          this.loggedIn = false
      } else {
          this.loggedIn = true;
      }
      // Subscription received B. It would not happen
      // for an Observable or Subject by default.
    });
  }
}
