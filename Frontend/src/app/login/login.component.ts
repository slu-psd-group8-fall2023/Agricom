import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authCtrl:any;
  constructor(private http: HttpClient) {
    this.showLogin();
  }

  reset() {
    this.authCtrl = {
      showSignIn:false,
      showSignUp:false,
      showPasswordReset:false,
      name: '',
      email: '',
      password: '',
      newPassword: '',
      confirmNewPassword: ''
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

  login() {
    let params = {
      username: this.authCtrl.email,
      password: this.authCtrl.password
    };
    let data = this.http.post(environment.LOGIN_API, params);
  }

  signup() {
    let params = {
      name: this.authCtrl.name,
      username: this.authCtrl.email,
      password: this.authCtrl.password
    };
    let data = this.http.post(environment.SIGNUP_API, params);
  }

  forgot_passsword() {
    let params = {
      username: this.authCtrl.newPassword,
      password: this.authCtrl.confirmNewPassword
    };
    let data = this.http.post(environment.FORGOT_PASS_API, params);
  }
}
