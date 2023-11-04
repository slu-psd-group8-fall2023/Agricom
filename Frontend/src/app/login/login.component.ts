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
                  this.authCtrl.errorMessage = error;
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
    try {
      this.defaultService.httpPostCall(environment.SIGNUP_API, params).subscribe(
        data => {
          this.toastr.success("You can now continue to login", "Signup Successful");
          this.showLogin();
        },
        err => {
          console.log(err);
        }
      )
    } catch(e) {
      this.authCtrl.errorMessage = e;
    }
  }

  async forgotPasssword() {
    let params = {
      email: this.authCtrl.email
    };
    try {
      this.defaultService.httpPostCall(environment.FORGOT_PASS_API, params).subscribe(
        data => {
          let response = data['data'];
          console.log(response);
          this.showResetPassword();
        },
        err => {
          console.log(err);
        }
      )
    } catch(e) {
      this.authCtrl.errorMessage = e;
    }
  }

  async resetPasssword() {
    if(this.authCtrl.newPassword != this.authCtrl.confirmNewPassword) {
      this.authCtrl.errorMessage = 'Passwords do not match';
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
          console.log(err);
        }
      )
    } catch(e) {
      this.authCtrl.errorMessage = e;
    }
  }
}
