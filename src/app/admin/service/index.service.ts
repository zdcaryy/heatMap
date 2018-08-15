import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { environment } from "../../../environments/environment";

@Injectable()
export class IndexService {
  // private url = `${environment.userUrl}/`;
  private url = 'http://192.168.31.32:8888';
  // private token = localStorage.getItem('access_token');
  constructor(
    private http: HttpClient
  ) { }
  getData(key: string): Observable<any> {
    return this.http.get<any>(this.url + key, { params: { access_token: localStorage.getItem('access_token') } });
  }

  postData(key: string, data): Observable<any> {
    var httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json; charset=UTF-8"
      })
    };
    if (key.indexOf('?') < 0) { key += '?access_token=' + localStorage.getItem('access_token') } else { key += '&access_token=' + localStorage.getItem('access_token') };
    return this.http.post<any>(this.url + key, data, httpOptions);
  }
  // 使用键值对的形式传递 -- 不手动设置的话，它就用默认的json格式了
  postFormData(key: string, data): Observable<any> {
    var httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' })
    };
    data['access_token'] = localStorage.getItem('access_token');
    var str = '';
    for (var i in data) {
      if (str.length > 0) { str += `&${i}=${data[i]}` } else { str += `${i}=${data[i]}` }
    }
    return this.http.post<any>(this.url + key, str, httpOptions);
  }

  // 不写header，会根据数据类型自动判断，当传的是FormData类型，自动 multiple/form-data，并且加上 boundary
  upFile(key: string, data: FormData): Observable<any> {
    // return this.http.post<any>(this.sdkUrl+key,data,this.httpOptions);
    var fileOptions = {
      headers: new HttpHeaders({})
    };
    data.append('access_token', localStorage.getItem('access_token'));
    return this.http.post<any>(this.url + key, data, fileOptions);
  }

}
