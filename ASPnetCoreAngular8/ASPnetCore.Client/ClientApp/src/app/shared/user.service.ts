import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  formModel: FormGroup = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    FullName: [''],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    },{validator: this.comparePasswords})
  });

  loginFormModel: FormGroup = this.fb.group({
    UserName: ['', Validators.required],
    Password: ['', Validators.required]
  });

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //confirmPswrdCtrl.errors={passwordMismatch:true}
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true});
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }

  register() {

    var model = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      Password:this.formModel.value.Passwords.Password,
      FullName: this.formModel.value.FullName,
    };

    return this.http.post(environment.apiRootUrl + '/ApplicationUser/Register/', model);
  }

  login(){
    var model = {
      UserName: this.loginFormModel.value.UserName,
      Password: this.loginFormModel.value.Password
    }

    return this.http.post(environment.apiRootUrl + '/ApplicationUser/login/', model)
  }

  getUserProfile(){
    return this.http.get(environment.apiRootUrl + '/UserProfile');
  }

  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    allowedRoles.forEach(element => {
      if (userRole == element) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }
}
