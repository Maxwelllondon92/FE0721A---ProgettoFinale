import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Progetto_Finale';
  constructor(private authSrv:AuthService){}
  ngOnInit(): void {
    moment.locale(window.navigator.language)
      this.authSrv.autoLogin()
  }
}
