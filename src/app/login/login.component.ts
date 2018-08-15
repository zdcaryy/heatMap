import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public errorMessage: string;
  constructor(
    private router: Router,
    private loginServive: LoginService
  ) { }

  ngOnInit() {
  }
  login(form: NgForm) {
    this.errorMessage = "";
    if (form.valid) {
      // this.fakeLogin();
      this.loginServive.login(this.username, this.password)
        .subscribe(response => {
          console.log(response);
          // this.router.navigateByUrl("/admin/equip");
          // localStorage.setItem('access_token', response.json().access_token);
        }, error => {
          console.log(error);
          this.errorMessage = "网络错误，请稍后再试...";
        })
    } else {
      this.errorMessage = "账号密码不能为空！";
    }
  }

  fakeLogin(){
      alert('登陆成功');
      localStorage.setItem('username','张合安安');
      this.router.navigate(['/']);
  }

}
