import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../environments/environment';
import { DefaultService } from "../default.service";
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authCtrl:any;
  toastrMessage:any;
  constructor(private defaultService:DefaultService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
    if (this.authenticationService.userValue) {
      this.router.navigate(['/feed']);
    }
    this.showLogin();
  }

  reset() {
    this.authCtrl = {
      showSignIn:false,
      showSignUp:false,
      showPasswordReset:false,
      showForgotPassword:false,
      name: '',
      email: '',
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      confirmPassword: '',
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
    this.authCtrl.showForgotPassword = true;
  }
  
  async showResetPassword() {
    this.reset()
    this.authCtrl.showPasswordReset = true;
  }

  async login() {
    let params = {
      username: this.authCtrl.email,
      password: this.authCtrl.password
    };
    if(!this.validateEmail(this.authCtrl.email)) {
      this.toastrMessage = "Invalid email"
      this.toastr.error(this.toastrMessage, "Form validation error");
      return;
    }
    if(!this.authCtrl.password) {
      this.toastrMessage = "Please enter password";
      this.toastr.error(this.toastrMessage, "Form validation error");
      return;
    }
    try {
      this.authenticationService.login(params.username, params.password)
            .pipe(first())
            .subscribe({
                next: () => {
                    // get return url from route parameters or default to '/'
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/feed';
                    this.router.navigate([returnUrl]);
                },
                error: error => {
                  this.authCtrl.errorMessage = error.error.error;
                }
            });
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
    if(this.authCtrl.password != this.authCtrl.confirmPassword) {
      this.toastr.error("Passwords didn't match", "Form validation error");
      return;
    }
    if(!this.authCtrl.name) {
      this.toastr.error("Please enter Name", "Form validation error");
      return;
    }
    if(!this.validateEmail(this.authCtrl.email)) {
      this.toastr.error("Invalid email", "Form validation error");
      return;
    }
    if(!this.authCtrl.password) {
      this.toastr.error("Please enter password", "Form validation error");
      return;
    }
    
    try {
      this.defaultService.httpPostCall(environment.SIGNUP_API, params).subscribe(
        data => {
          if(data.error) {
            this.toastr.error(data.error);
          } else {
            this.toastr.success("You can now continue to login", "Signup Successful");
            this.showLogin();
          }
        },
        err => {
          this.authCtrl.errorMessage = err.error.error;
          console.log(err);
        }
      )
    } catch(e) {
      this.authCtrl.errorMessage = e;
    }
  }

  checkEmail() {

  }

  async forgotPasssword() {
    let params = {
      email: this.authCtrl.email
    };
    if(!this.validateEmail(this.authCtrl.email)) {
      this.toastr.error("Invalid email", "Form validation error");
      return;
    }
    try {
      this.defaultService.httpPostCall(environment.FORGOT_PASS_API, params).subscribe(
        data => {
          let response = data['data'];
          console.log(response);
          this.showResetPassword();
        },
        err => {
          this.toastr.error("Please enter a valid email", "User doesn't exist");
          console.log(err);
        }
      )
    } catch(e) {
      this.authCtrl.errorMessage = e;
    }
  }

  async resetPasssword() {
    if(this.authCtrl.newPassword != this.authCtrl.confirmNewPassword) {
      this.toastr.error("Passwords do not match", "Form validation error");
      this.authCtrl.errorMessage = 'Passwords do not match';
      return;
    }
    if(!this.authCtrl.token) {
      this.toastr.error("Please enter a valid token", "Form validation error");
      return;
    }
    if(!this.authCtrl.newPassword) {
      this.toastr.error("Please enter password", "Form validation error");
      return;
    }
    let params = {
      token: this.authCtrl.token,
      username: this.authCtrl.email,
      newPassword: this.authCtrl.confirmNewPassword
    };
    
    try {
      this.defaultService.httpPostCall(`${environment.RESET_PASS_API}/${this.authCtrl.token}`, params).subscribe(
        data => {
          this.toastr.success("You can now continue to login", "Password Reset Successful");
          this.showLogin();
        },
        err => {
          this.authCtrl.errorMessage = err.error.error;
          this.toastr.error(err.error.error, "Request Error");
          console.log(err);
        }
      )
    } catch(e) {
      this.authCtrl.errorMessage = e;
    }
  }

  validateEmail(email:string){
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
}
