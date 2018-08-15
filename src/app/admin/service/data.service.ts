import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class DataService {

  constructor(private http:HttpClient) { }
  // private dataUrl = environment.serverUrl;
  private dataUrl="http://192.168.31.32:8888";
  getData(key:string):Observable<any>{
    return this.http.get<any>(this.dataUrl+key,{params:{access_token:localStorage.getItem('access_token')}});
  };
  //angular默认传json格式
  postData(key:string,data):Observable<any>{
    key += '?access_token='+localStorage.getItem('access_token');
    return this.http.post<any>(this.dataUrl+key,data);
  };
  //手动编码转成键值对
  postFormData(key:string,data):Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'})
    };
    data['access_token'] = localStorage.getItem('access_token');
    let str = '';
    for(let i in data){
      if(str.length>0){str += `&${i}=${data[i]}`}else{str += `${i}=${data[i]}`}
    }
    return this.http.post<any>(this.dataUrl+key,str,httpOptions);
  }
}
