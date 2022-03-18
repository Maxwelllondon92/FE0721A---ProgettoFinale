import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserPackage } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  getAllUsers() {
    return this.http
      .get<UserPackage>(
        environment.pathApi + `/api/users?sort=id&size=2000`
      )
      .pipe(
        map((res) => {
          return res.content;
        })
      );
  }
}
