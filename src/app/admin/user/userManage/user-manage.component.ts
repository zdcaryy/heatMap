import { Component, OnInit } from '@angular/core';
import { UserService  } from "../../service/user.service";

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {

  constructor(
    private userService:UserService
  ) { }

  showModal:boolean=false;

  heads: any = [
    { label: "序号", field: 'num' },
    { label: "姓名", field: 'nickName' },
    { label: "电话号码", field: 'phoneNumber' },
    { label: "权限", field: 'level' },
    { label: "操作", field: 'operate', operate: true, operations: ['修改', '删除'] }
  ];
  user_data: any;

  ngOnInit() {
    this.getUserData(1);
  }
  
  getUserData(page){
   let size = 10;
    this.showLoading();
    this.userService.getData('/user/all?pageSize='+page+'&currentPage=' + page+'').subscribe(
      res => {
        this.user_data = res.data.map((item, index) => { item.num = this.addZero((page - 1) * size + (index + 1), 2); item.level = this.userFormat(item.level);return item });
        this.hideLoading();
        console.log(this.user_data)
      }
    );
  }
  //最低位数，不足补 0
  addZero(num, size) {
    let ns = num.toString().length;
    let res = '';
    if (ns < size) {
      console.log(size - ns);
      for (let i = 1; i <= size - ns; i++) {
        res += '0';
      }
    }
    return res + num.toString();
  }
 // 枚举用户权限
   userFormat(e){
     var name ;
     switch (e) {
       case 0: name = "普通用户";break;
       case 1: name = "管理员";break;
       case 2: name = "超级管理员";break;
     }
     return name;
   }
  //分页
  pageSize: number = 5;
  totalPage: number;
  getPage(e) {
    console.log(e);
    this.getUserData(e.page);
  }
  //操作
  getOperateEvent(e) {
    console.log(e);
    switch (e.option) {
      case "修改":
        this.modify(e.data);
        break;
      case "删除":
        this.delOne(e.data);
        break;
      case "重置密码":
        this.resetPwd(e.data);
        break;
      default:
        // code...
        break;
    }
  }
  //修改数据对象
  modifyInfo = {
    nickName: '',
    phoneNumber: '',
    password: '',
    level: '',
  };
  modify(e){
    
    this.modifyInfo = e;
    this.showModal = true;
    console.log(this.modifyInfo);
  }
  delOne(e){
    console.log(e);     
  }
  resetPwd(e){
    console.log(e);     
  }
  //提交修改
  confirmModify(){
    this.userService.postFormData('',this.modifyInfo).subscribe(
      data=>{
        console.log(data.msg);
      }
    );
  }

  //是否显示加载动画
  ifShowLoading: boolean = false;
  showLoading() { this.ifShowLoading = true; }
  hideLoading() { this.ifShowLoading = false; }
}
