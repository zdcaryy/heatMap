import { Component, OnInit } from '@angular/core';

import { UserService } from "../../service/user.service";

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  //添加的用户对象
  addUser = {
    nickName: '',
    phoneNumber: '',
    password: '',
    level: '',
  };

  constructor(
    private userService:UserService
  ) { }

  ngOnInit() {
  }
  onSubmit(){
    this.userService.postData('/user/add', this.addUser).subscribe(
      data => {
          alert(data.msg);
          this.ngOnInit
       }
    );
  }
}
