import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  constructor(private http:HttpClient) { }

  isLogin():Observable<any>{
    // return this.http.post<any>(this.sdkUrl+key,data,this.httpOptions);
    return this.http.get<any>('http://192.168.31.34:8881',{params:{access_token:localStorage.getItem('access_token')}});
  }

}
