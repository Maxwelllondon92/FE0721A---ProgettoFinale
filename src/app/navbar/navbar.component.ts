import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit,OnDestroy {
  constructor(private authSrv:AuthService) {}
  userLogged:boolean=false;
  userName!:string|undefined
  private userSub!: Subscription;
  admin!: boolean;
  logout(){
    this.authSrv.logout(false)
  }
  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.admin = userData.roles.includes('ROLE_ADMIN');
    this.userSub = this.authSrv.user.subscribe(user=>{
      this.userLogged = this.authSrv.userSuccess? true:false;
      this.userName = user? this.authSrv.user.value?.username:''
    });
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
