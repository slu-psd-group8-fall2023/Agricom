import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authCtrl:any;
  constructor() {
    this.showLogin();
  }

  reset() {
    this.authCtrl = {
      showSignIn:false,
      showSignUp:false,
      showPasswordReset:false
    }
  }
  showLogin() {
    this.reset()
    this.authCtrl.showSignIn = true;
  }

  showSignup() {
    this.reset()
    this.authCtrl.showSignUp = true;

  }

  showForgotpassword() {
    this.reset()
    this.authCtrl.showPasswordReset = true;
  }
}
