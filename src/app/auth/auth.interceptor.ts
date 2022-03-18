import { HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor {

  constructor(private authSrv:AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler){
    // if(req.url==this.authSrv.url+"/login"||req.url==this.authSrv.url+"/signup"){
    //   return next.handle(req)
    // }
    return this.authSrv.user.pipe(
      take(1),
      exhaustMap((user) => {
        if(user){
          const superReq = req.clone(
            {headers:new HttpHeaders({
              'Authorization':`Bearer ${user.token}`,
              'X-TENANT-ID':`fe_0721a`
            })})
            return next.handle(superReq)
          }
          return next.handle(req)
      }))
  }
}
