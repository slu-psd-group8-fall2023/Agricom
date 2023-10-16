import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { DefaultService } from "../default.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authCtrl:any;
  constructor(private defaultService:DefaultService) {
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
      confirmNewPassword: '',
      token: '',
      passwordNoMatch: false,
      errorMessage: ''
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

  async login() {
    let params = {
      username: this.authCtrl.email,
      password: this.authCtrl.password
    };
    try {
      let data = await this.defaultService.httpPostCall(environment.LOGIN_API, params);
      console.log(data);
    } catch(e) {
      this.authCtrl.errorMessage = e;
    }
  }

  async signup() {
    let params = {
      name: this.authCtrl.name,
      username: this.authCtrl.email,
      password: this.authCtrl.password
    };
    try {
      let data = await this.defaultService.httpPostCall(environment.SIGNUP_API, params);
      console.log(data);
    } catch(e) {
      this.authCtrl.errorMessage = e;
    }
  }

  async forgotPasssword() {
    if(this.authCtrl.newPassword != this.authCtrl.confirmNewPassword) {
      this.authCtrl.errorMessage = 'Passwords do not match';
      return;
    }
    let params = {
      token: this.authCtrl.token,
      username: this.authCtrl.email,
      password: this.authCtrl.confirmNewPassword
    };
    
    try {
      let data = await this.defaultService.httpPostCall(environment.FORGOT_PASS_API, params);
      console.log(data);
    } catch(e) {
      this.authCtrl.errorMessage = e;
    }
  }
}
