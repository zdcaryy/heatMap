import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class EquipService {

  constructor(private http:HttpClient) { 
    console.log(window.location.origin)
  }

  // private adUrl = environment.serverUrl;
  private adUrl = 'http://192.168.31.32:8888';
  // private adUrl = window.location.origin;

  getData(key:string):Observable<any>{
    // return this.http.post<any>(this.sdkUrl+key,data,this.httpOptions);
    return this.http.get<any>(this.adUrl+key,{params:{access_token:localStorage.getItem('access_token')}});
  }

  // 一般数据(data是一般的对象之类的)，Content-Type 默认是 json，所以这里写上只是为了方便区分
  postData(key:string,data):Observable<any>{
    var httpOptions = {
      headers: new HttpHeaders({
        "Content-Type":  "application/json; charset=UTF-8"
      })
    };
    //json数据token好像不能加在data里面
    if(key.indexOf('?')<0){key+='?access_token='+localStorage.getItem('access_token')}else{key+='&access_token='+localStorage.getItem('access_token')};
    // return this.http.post<any>(this.sdkUrl+key,data,this.httpOptions);
    return this.http.post<any>(this.adUrl+key,data,httpOptions);
  }
  // 使用键值对的形式传递 -- 不手动设置的话，它就用默认的json格式了
  postFormData(key:string,data):Observable<any>{
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'})
    };
    data['access_token'] = localStorage.getItem('access_token');
    var str = '';
    for(var i in data){
      if(str.length>0){str += `&${i}=${data[i]}`}else{str += `${i}=${data[i]}`}
    }
    return this.http.post<any>(this.adUrl+key,str,httpOptions);
  }

  // 不写header，会根据数据类型自动判断，当传的是FormData类型，自动 multiple/form-data，并且加上 boundary
  upFile(key:string,data:FormData):Observable<any>{
    // return this.http.post<any>(this.sdkUrl+key,data,this.httpOptions);
    var fileOptions = {
      headers: new HttpHeaders({  })
    };
    data.append('access_token',localStorage.getItem('access_token'));
    return this.http.post<any>(this.adUrl+key,data,fileOptions);
  }

  //最低位数，不足补 0
  addZero(num,size){
    let ns = num.toString().length;
    let res = '';
    if(ns<size){
      for(let i=1;i<=size-ns;i++){
        res+='0';
      }
    }
    return res+num.toString();
  } 

  //获取地图
  getMapSrc(){
    return this.adUrl+'/map/show';
  }

}
