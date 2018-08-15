import { Injectable } from '@angular/core';
import { Router } from '@angular/router';	
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard {

  constructor(private auth:AuthService,private router:Router) { }

  canActivateChild(){
         console.log('routing auth');
        return new Observable(ob=>{
            this.auth.isLogin().subscribe(res=>{
                //判断res
                ob.next(true);
            },err=>{
                console.log('canActivate Err',err);
                //跳转登录
                ob.next(false);
                alert('请登录...');
                this.router.navigate(['/login']);
            });
        });
    }

}
