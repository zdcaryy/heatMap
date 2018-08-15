import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  count:number = 0;

  tel:string = '';
  errMsg:string = '';

  getCode(){
  	if(!this.checkTel(this.tel)){this.errMsg = '*请输入正确的手机号！';return;};
  	this.errMsg = '';
  	this.count = 6;
  	let t = setInterval(()=>{
  		this.count-=1;
  		console.log('bababaab')
  		if(this.count<=0){
  			clearInterval(t);
  		}
  	},1000);
  }

  checkTel(tel){
  	let mobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  	return mobile.test(tel);
  }

}
